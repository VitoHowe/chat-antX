import React, { useRef } from "react";
import {
  XProvider,
  Bubble,
  Sender,
  Conversations,
  Prompts,
  Suggestion,
  ThoughtChain,
} from "@ant-design/x";
import {
  Flex,
  Select,
  Space,
  Button,
  Modal,
  Input,
  Popconfirm,
} from "antd";
import type { GetRef } from "antd";
import {
  BulbOutlined,
  SmileOutlined,
  UserOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import type { BubbleProps } from "@ant-design/x";
import { useXAgent, useXChat } from "@ant-design/x";
import { API_CONFIG } from "@/config/api";
import { useConversations } from "@/hooks/useConversations";
import { useModelSelection } from "@/hooks/useModelSelection";
import type { Message, ConversationItem } from "@/types";
// 样式导入
import '@/styles/components/ProductList.css';

export default () => {
  const [value, setValue] = React.useState("");
  const listRef = React.useRef<GetRef<typeof Bubble.List>>(null);
  const abortController = useRef<AbortController | null>(null);

  // 使用自定义hooks
  const {
    conversations,
    activeConversationKey,
    editingConversation,
    isEditModalVisible,
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

  return (
    <>
      <XProvider>
        <Flex className="product-list-container">
          <Flex vertical className="conversation-sidebar">
            {/* 新建对话按钮区域 */}
            <div className="conversation-header">
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={createConversation}
                className="create-conversation-btn"
              >
                新建对话
              </Button>
            </div>

            {/* 对话列表 */}
            <div className="conversation-list-container">
              <Conversations
                className="conversation-list"
                styles={{
                  item: {}
                }}
                classNames={{
                  item: "conversation-item"
                }}
                activeKey={activeConversationKey}
                onActiveChange={changeConversation}
                items={conversations}
                menu={(conversation) => ({
                  items: [
                    {
                      key: "edit",
                      label: "重命名",
                      icon: <EditOutlined />,
                      onClick: () => {
                        const conversationItem: ConversationItem = {
                          key: conversation.key,
                          label: typeof conversation.label === 'string' ? conversation.label : '新对话',
                          icon: conversation.icon || <MessageOutlined />,
                          timestamp: (conversation as any).timestamp || Date.now(),
                        };
                        startEditConversation(conversationItem);
                      },
                    },
                    {
                      key: "delete",
                      label: (
                        <Popconfirm
                          title="确认删除"
                          description="确定要删除这个对话吗？删除后无法恢复。"
                          onConfirm={() => deleteConversation(conversation.key)}
                          okText="确认"
                          cancelText="取消"
                          placement="topRight"
                        >
                          <span className="delete-conversation-text">删除对话</span>
                        </Popconfirm>
                      ),
                      icon: <DeleteOutlined />,
                      danger: true,
                    },
                  ],
                })}
              />
            </div>
          </Flex>

          <Flex vertical className="chat-main-area">
            <Bubble.List
              ref={listRef}
              className="message-list"
              roles={rolesAsFunction}
              items={messages.map(({ id, message }) => {
                return {
                  key: id,
                  role: message.role || "user",
                  content: message.content || "",
                };
              })}
            />
            
            <Prompts
              items={[
                {
                  key: "1",
                  icon: <BulbOutlined style={{ color: "#FFD700" }} />,
                  label: "Ignite Your Creativity",
                },
                {
                  key: "2",
                  icon: <SmileOutlined style={{ color: "#52C41A" }} />,
                  label: "Tell me a Joke",
                },
              ]}
            />
            
            <Space wrap className="model-selector-area">
              <Select
                placeholder="Select a modelSource"
                value={selectedModelSource}
                optionFilterProp="label"
                onChange={changeModelSource}
                options={sourceOptions}
                style={{ width: 200 }}
                className="model-select"
              />
              <Select
                showSearch
                placeholder="Select a model"
                value={selectedModel}
                optionFilterProp="label"
                onChange={changeModel}
                onSearch={searchModels}
                options={filteredOptions}
                style={{ width: 300 }}
                className="model-select"
              />
            </Space>

            <Suggestion items={[{ label: "Write a report", value: "report" }]}>
              {({ onTrigger, onKeyDown }) => {
                return (
                  <Sender
                    value={value}
                    loading={agent.isRequesting()}
                    onChange={(nextVal) => {
                      if (nextVal === "/") {
                        onTrigger();
                      } else if (!nextVal) {
                        onTrigger(false);
                      }
                      setValue(nextVal);
                    }}
                    onKeyDown={onKeyDown}
                    onSubmit={(nextContent) => {
                      onRequest({
                        stream: true,
                        message: {
                          role: "user",
                          content: nextContent,
                        },
                      });
                      setValue("");
                    }}
                    onCancel={() => {
                      abortController?.current?.abort?.();
                    }}
                    placeholder='Type "/" to trigger suggestion'
                  />
                );
              }}
            </Suggestion>
          </Flex>
        </Flex>

        {/* 编辑对话标题的模态框 */}
        <Modal
          title={
            <span className="text-gradient">
              重命名对话
            </span>
          }
          open={isEditModalVisible}
          onOk={saveEditConversation}
          onCancel={cancelEditConversation}
          okText="保存"
          cancelText="取消"
          width={450}
          className="edit-conversation-modal"
          okButtonProps={{
            className: "modal-ok-btn"
          }}
          cancelButtonProps={{
            className: "modal-cancel-btn"
          }}
        >
          <Input
            value={editingConversation?.label || ""}
            onChange={(e) => updateEditingLabel(e.target.value)}
            placeholder="请输入对话标题"
            maxLength={50}
            showCount
            onPressEnter={saveEditConversation}
            className="edit-conversation-input"
          />
        </Modal>

        <ThoughtChain />
      </XProvider>
    </>
  );
};
