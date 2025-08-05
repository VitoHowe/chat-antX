import React, { useRef } from "react";
import {
  XProvider,
  ThoughtChain,
} from "@ant-design/x";
import {
  Flex,
  Spin,
} from "antd";
import type { GetRef } from "antd";
import {
  UserOutlined,
} from "@ant-design/icons";
import type { BubbleProps } from "@ant-design/x";
import { useXAgent, useXChat } from "@ant-design/x";
import { API_CONFIG } from "@/config/api";
import { useConversations } from "@/hooks/useConversations";
import { useModelSelection } from "@/hooks/useModelSelection";
import type { Message } from "@/types";
// 导入新的子组件
import ConversationSidebar from "./ConversationSidebar";
import ChatMainArea from "./ChatMainArea";
import EditConversationModal from "./EditConversationModal";
// 样式导入
import '@/styles/components/chat/ProductList.css';

export default () => {
  const [value, setValue] = React.useState("");
  const abortController = useRef<AbortController | null>(null);
  const prevIsRequestingRef = useRef<boolean>(false);
  // 跟踪用户是否在当前对话中发送了消息
  const [hasUserInteractedInCurrentConversation, setHasUserInteractedInCurrentConversation] = React.useState<boolean>(false);

  // 使用自定义hooks
  const {
    conversations,
    activeConversationKey,
    editingConversation,
    isEditModalVisible,
    loading,
    currentMessages,
    loadingMessages,
    createConversation,
    startEditConversation,
    saveEditConversation,
    cancelEditConversation,
    deleteConversation,
    changeConversation,
    updateEditingLabel,
    saveConversationMessages,
    loadConversationMessages,
    updateCurrentMessages,
    clearCurrentMessages,
  } = useConversations();

  const {
    filteredOptions,
    selectedModel,
    sourceOptions,
    selectedModelSource,
    changeModel,
    changeModelSource,
    searchModels,
  } = useModelSelection();

  const [agent] = useXAgent<Message>({
    baseURL: `${API_CONFIG.baseURL}?type=${selectedModelSource}`,
    model: selectedModel,
    dangerouslyApiKey: `Bearer ${localStorage.getItem("authToken")}`,
  });

  const { onRequest, messages } = useXChat({
    agent,
    requestFallback: (_, { error }) => {
      if (error.name === "AbortError") {
        return {
          content: "Request is aborted",
          role: "assistant" as const,
        };
      }
      return {
        content: "Request failed, please try again!",
        role: "assistant" as const,
      };
    },
    requestPlaceholder: () => {
      return {
        content: "Please wait...",
        role: "assistant" as const,
      };
    },
    transformMessage: (info) => {
      const { originMessage, chunk } = info || {};
      let currentContent = "";
      let currentThink = "";
      try {
        if (chunk?.data && !chunk?.data.includes("DONE")) {
          const message = JSON.parse(chunk?.data);
          currentThink = message?.choices?.[0]?.delta?.reasoning_content || "";
          currentContent = message?.choices?.[0]?.delta?.content || "";
        }
      } catch (error) {
        console.error(error);
      }

      let content = "";

      if (!originMessage?.content && currentThink) {
        content = `<think>${currentThink}`;
      } else if (
        originMessage?.content?.includes("<think>") &&
        !originMessage?.content.includes("</think>") &&
        currentContent
      ) {
        content = `${originMessage?.content}</think>${currentContent}`;
      } else {
        content = `${
          originMessage?.content || ""
        }${currentThink}${currentContent}`;
      }

      return {
        content: content,
        role: "assistant" as const,
      };
    },
    resolveAbortController: (controller) => {
      abortController.current = controller;
    },
  });

  // 消息合并函数：将历史消息和新消息合并，避免重复
  const mergeMessages = React.useCallback((
    historyMessages: Array<{ id: string; message: Message }>,
    newMessages: Array<{ id: any; message: Message }>
  ) => {
    // 将新消息标记为非历史消息
    const formattedNewMessages = newMessages.map(({ id, message }) => ({
      id: String(id),
      message: {
        ...message,
        isHistorical: false,
      },
    }));

    // 如果没有历史消息，直接返回新消息
    if (historyMessages.length === 0) {
      return formattedNewMessages;
    }

    // 如果没有新消息，直接返回历史消息
    if (formattedNewMessages.length === 0) {
      return historyMessages;
    }

    // 更智能的去重逻辑：查找历史消息和新消息的分界点
    // 从新消息的开头开始，找到第一条不在历史消息中的消息
    let startIndex = 0;
    for (let i = 0; i < formattedNewMessages.length; i++) {
      const newMsg = formattedNewMessages[i];
      const isDuplicate = historyMessages.some(histMsg => 
        histMsg.message.role === newMsg.message.role &&
        histMsg.message.content === newMsg.message.content
      );
      
      if (!isDuplicate) {
        startIndex = i;
        break;
      }
      
      // 如果找到了重复的消息，继续查找
      if (i === formattedNewMessages.length - 1) {
        // 所有新消息都是重复的
        return historyMessages;
      }
    }

    // 合并消息：历史消息 + 新的不重复消息
    return [...historyMessages, ...formattedNewMessages.slice(startIndex)];
  }, []);

  // 监听请求状态变化，自动保存消息
  React.useEffect(() => {
    const currentIsRequesting = agent.isRequesting();
    
    // 当请求从进行中变为完成时，保存消息
    // 添加额外条件：确保当前有活跃对话且消息列表不为空，且用户已在当前对话中交互
    if (prevIsRequestingRef.current && 
        !currentIsRequesting && 
        messages.length > 0 && 
        activeConversationKey &&
        !loadingMessages && // 确保不在加载历史消息时保存
        hasUserInteractedInCurrentConversation) { // 确保用户已在当前对话中交互
      
      // 合并历史消息和新消息，然后保存
      const allMessages = mergeMessages(currentMessages, messages);
      saveConversationMessages(allMessages);
      
      // 更新本地消息状态
      updateCurrentMessages(allMessages);
    }
    
    prevIsRequestingRef.current = currentIsRequesting;
  }, [agent.isRequesting(), messages, currentMessages, activeConversationKey, loadingMessages, hasUserInteractedInCurrentConversation, saveConversationMessages, updateCurrentMessages, mergeMessages]);

  // 监听活跃对话变化，确保状态同步
  React.useEffect(() => {
    if (activeConversationKey) {
      // 当对话切换时，重置请求状态引用
      prevIsRequestingRef.current = false;
      
      // 重置用户交互状态，确保不会显示前一个对话的useXChat消息
      setHasUserInteractedInCurrentConversation(false);
      
      // 清空当前显示的消息，等待历史消息加载
      // 这可以避免显示前一个对话的useXChat消息
      setValue(""); // 清空输入框
    }
  }, [activeConversationKey]);

  // 获取显示用的消息：直接使用currentMessages作为显示数据源
  const getDisplayMessages = React.useCallback(() => {
    // 直接返回currentMessages，它包含了历史消息和实时同步的新消息
    return currentMessages;
  }, [currentMessages]);

  // 转换消息格式，确保id为string类型
  const formattedMessages = getDisplayMessages();

  const rolesAsFunction = (bubbleData: BubbleProps, index: number) => {
    switch (bubbleData.role) {
      case "assistant":
        // 获取对应的消息数据以检查是否为历史消息
        const messageData = formattedMessages[index];
        const isHistorical = messageData?.message?.isHistorical || false;
        
        return {
          placement: "start" as const,
          avatar: { icon: <UserOutlined />, style: { background: "#fde3cf" } },
          // 只有非历史消息才显示打字效果
          typing: isHistorical ? false : { step: 1, interval: 20 },
          style: {
            maxWidth: 600,
          },
        };
      case "user":
        return {
          placement: "end" as const,
          avatar: { icon: <UserOutlined />, style: { background: "#87d068" } },
        };
      default:
        return {};
    }
  };

  const handleSubmit = (content: string) => {
    // 标记用户在当前对话中开始了交互
    setHasUserInteractedInCurrentConversation(true);
    
    onRequest({
      stream: true,
      message: {
        role: "user",
        content,
      },
    });
  };

  const handleCancel = () => {
    abortController?.current?.abort?.();
  };

  // 转换编辑对话数据格式
  const formattedEditingConversation = editingConversation ? {
    ...editingConversation,
    icon: null,
    timestamp: Date.now(),
  } : null;

  // 如果正在加载对话数据，显示加载指示器
  if (loading) {
    return (
      <div className="product-list-container">
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '100%' 
        }}>
          <Spin size="large" tip="正在加载对话数据..." />
        </div>
      </div>
    );
  }

  return (
    <>
      <XProvider>
        <Flex className="product-list-container">
          {/* 对话侧边栏 */}
          <ConversationSidebar
            conversations={conversations}
            activeConversationKey={activeConversationKey}
            onCreateConversation={createConversation}
            onChangeConversation={changeConversation}
            onStartEditConversation={startEditConversation}
            onDeleteConversation={deleteConversation}
          />

          {/* 聊天主区域 */}
          <ChatMainArea
            messages={formattedMessages}
            value={value}
            onValueChange={setValue}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isRequesting={agent.isRequesting()}
            rolesAsFunction={rolesAsFunction}
            filteredOptions={filteredOptions}
            selectedModel={selectedModel}
            sourceOptions={sourceOptions}
            selectedModelSource={selectedModelSource}
            onModelChange={changeModel}
            onModelSourceChange={changeModelSource}
            onSearchModels={searchModels}
          />
        </Flex>

        {/* 编辑对话标题的模态框 */}
        <EditConversationModal
          visible={isEditModalVisible}
          editingConversation={formattedEditingConversation}
          onSave={saveEditConversation}
          onCancel={cancelEditConversation}
          onLabelChange={updateEditingLabel}
        />

        <ThoughtChain />
      </XProvider>
    </>
  );
};
