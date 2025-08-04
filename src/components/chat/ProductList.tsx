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

  const rolesAsFunction = (bubbleData: BubbleProps, index: number) => {
    switch (bubbleData.role) {
      case "assistant":
        return {
          placement: "start" as const,
          avatar: { icon: <UserOutlined />, style: { background: "#fde3cf" } },
          typing: { step: 1, interval: 20 },
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

  // 转换消息格式，确保id为string类型
  const formattedMessages = messages.map(({ id, message }) => ({
    id: String(id),
    message,
  }));

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
