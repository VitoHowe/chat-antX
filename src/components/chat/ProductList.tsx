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
  const hasInitializedRef = useRef<boolean>(false);
  const isDeletingConversationRef = useRef<boolean>(false);
  
  // 消息历史记录 - 参考简化模式
  const [messageHistory, setMessageHistory] = React.useState<Record<string, any>>({});

  // 使用自定义hooks
  const {
    conversations,
    activeConversationKey,
    editingConversation,
    isEditModalVisible,
    loading,
    createConversation,
    startEditConversation,
    saveEditConversation,
    cancelEditConversation,
    deleteConversation,
    changeConversation,
    updateEditingLabel,
    saveConversationMessages,
    getConversationMessages,
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

  const { onRequest, messages, setMessages } = useXChat({
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

  // 简化的消息历史管理 - 参考提供的模式
  React.useEffect(() => {
    if (messages?.length && activeConversationKey) {
      // 检查当前对话是否还存在
      const conversationExists = conversations.some(conv => conv.key === activeConversationKey);
      
      if (conversationExists) {
        setMessageHistory((prev) => ({
          ...prev,
          [activeConversationKey]: messages,
        }));
      }
    }
  }, [messages, activeConversationKey, conversations]);

  // 监听请求状态变化，在请求完成时保存消息
  React.useEffect(() => {
    const currentIsRequesting = agent.isRequesting();
    
    // 当请求从进行中变为完成时，保存消息
    if (prevIsRequestingRef.current && !currentIsRequesting) {
      // 在请求完成时获取最新的消息和对话状态
      const currentMessages = messages;
      const currentConversationKey = activeConversationKey;
      
      // 检查当前对话是否还存在
      const conversationExists = conversations.some(conv => conv.key === currentConversationKey);
      
      if (currentMessages.length > 0 && currentConversationKey && conversationExists) {
        // 转换消息格式用于保存
        const messagesToSave = currentMessages.map((item, index) => ({
          message: {
            role: item.message?.role || "user",
            content: item.message?.content || "",
          },
        }));
        
        saveConversationMessages(messagesToSave);
      }
    }
    
    prevIsRequestingRef.current = currentIsRequesting;
  }, [agent.isRequesting(), activeConversationKey, conversations, messages]);

  // 创建新对话并清空消息
  const handleCreateConversation = React.useCallback(async () => {
    // 先清空当前消息
    setMessages([]);
    
    // 创建新对话
    await createConversation();
  }, [createConversation]);

  // 删除对话并切换到下一个对话
  const handleDeleteConversation = React.useCallback(async (conversationKey: string) => {
    // 设置删除标记，防止其他地方的查询
    isDeletingConversationRef.current = true;
    
    try {
      // 检查是否是当前活跃的对话
      const isDeletingActive = conversationKey === activeConversationKey;
      
      // 如果是删除当前活跃对话，先清空消息
      if (isDeletingActive) {
        setMessages([]);
      }
      
      // 执行删除操作
      const success = await deleteConversation(conversationKey);
      
      // 只有在删除成功且删除的是当前活跃对话时，才加载新对话的消息
      if (success && isDeletingActive) {
        // 等待一小段时间让状态完全更新
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // 获取删除后的新活跃对话
        const newConversations = conversations.filter(item => item.key !== conversationKey);
        if (newConversations.length > 0) {
          const newActiveKey = newConversations[0].key;
          
          // 直接调用 changeConversation 来更新活跃对话
          await changeConversation(newActiveKey);
          
          // 然后加载新对话的历史消息
          const historyMessages = await getConversationMessages(newActiveKey);
          
          // 将历史消息转换为useXChat需要的格式
          const formattedHistoryMessages = historyMessages.map((msg: any, index: number) => ({
            id: `history-${newActiveKey}-${index}`,
            message: {
              role: msg.role,
              content: msg.content,
              isHistorical: true,
            },
            status: 'success' as const,
          }));
          
          setMessages(formattedHistoryMessages);
        }
      }
    } finally {
      // 清除删除标记
      isDeletingConversationRef.current = false;
    }
  }, [deleteConversation, conversations, activeConversationKey, getConversationMessages, changeConversation]);

  // 简化的对话切换处理
  const handleChangeConversation = React.useCallback(async (conversationKey: string) => {
    // 如果正在删除对话，不执行切换
    if (isDeletingConversationRef.current) {
      return;
    }
    
    // 取消当前请求
    abortController.current?.abort();
    
    // 延迟切换，避免时序问题
    setTimeout(async () => {
      changeConversation(conversationKey);
      
      // 加载历史消息
      const historyMessages = await getConversationMessages(conversationKey);
      
      // 将历史消息转换为useXChat需要的格式
      const formattedHistoryMessages = historyMessages.map((msg: any, index: number) => ({
        id: `history-${conversationKey}-${index}`,
        message: {
          role: msg.role,
          content: msg.content,
          isHistorical: true,
        },
        status: 'success' as const,
      }));
      
      setMessages(formattedHistoryMessages);
    }, 100);
  }, [changeConversation, getConversationMessages, setMessages]);

  // 在初始化完成时加载默认对话的历史消息（只执行一次）
  React.useEffect(() => {
    if (!loading && activeConversationKey && !hasInitializedRef.current) {
      // 标记已经初始化过
      hasInitializedRef.current = true;
      // 初始化完成后，加载默认对话的历史消息
      handleChangeConversation(activeConversationKey);
    }
  }, [loading, activeConversationKey, handleChangeConversation]);

  // 转换消息格式用于显示
  const formattedMessages = React.useMemo(() => {
    return messages?.map((item, index) => ({
      id: String(item.id || index),
      message: {
        role: item.message?.role || "user",
        content: item.message?.content || "",
        isHistorical: (item.message as any)?.isHistorical || false,
      },
    })) || [];
  }, [messages]);

  const rolesAsFunction = (bubbleData: BubbleProps, index: number) => {
    switch (bubbleData.role) {
      case "assistant":
        // 获取对应的消息数据以检查是否为历史消息
        const messageData = formattedMessages[index];
        const isHistorical = messageData?.message?.isHistorical || false;
        console.log(messages,'formattedMessages',messageData);
        return {
          placement: "start" as const,
          avatar: { icon: <UserOutlined />, style: { background: "#fde3cf" } },
          typing: isHistorical ? false : { step: 1, interval: 20 }, // 简化打字效果
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
            onCreateConversation={handleCreateConversation}
            onChangeConversation={handleChangeConversation}
            onStartEditConversation={startEditConversation}
            onDeleteConversation={handleDeleteConversation}
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
