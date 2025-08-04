/**
 * 聊天主区域组件
 * 负责消息展示、提示功能、模型选择和消息发送等功能
 */

import React, { useRef } from 'react';
import {
  Flex,
  Select,
  Space,
} from 'antd';
import type { GetRef } from 'antd';
import {
  BulbOutlined,
  SmileOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Bubble,
  Sender,
  Prompts,
  Suggestion,
} from '@ant-design/x';
import type { BubbleProps } from '@ant-design/x';
import type { Message } from '@/types';
import '@/styles/components/chat/ChatMainArea.css';

interface ChatMainAreaProps {
  /** 消息列表 */
  messages: Array<{ id: string; message: Message }>;
  /** 消息发送值 */
  value: string;
  /** 消息发送值变更处理函数 */
  onValueChange: (value: string) => void;
  /** 消息发送处理函数 */
  onSubmit: (content: string) => void;
  /** 请求取消处理函数 */
  onCancel: () => void;
  /** 是否正在请求中 */
  isRequesting: boolean;
  /** 角色配置函数 */
  rolesAsFunction: (bubbleData: BubbleProps, index: number) => any;
  /** 过滤后的模型选项 */
  filteredOptions: Array<{ label: string; value: string }>;
  /** 当前选中的模型 */
  selectedModel: string;
  /** 模型来源选项 */
  sourceOptions: Array<{ label: string; value: string }>;
  /** 当前选中的模型来源 */
  selectedModelSource: string;
  /** 模型变更处理函数 */
  onModelChange: (value: string) => void;
  /** 模型来源变更处理函数 */
  onModelSourceChange: (value: string) => void;
  /** 模型搜索处理函数 */
  onSearchModels: (search: string) => void;
}

const ChatMainArea: React.FC<ChatMainAreaProps> = ({
  messages,
  value,
  onValueChange,
  onSubmit,
  onCancel,
  isRequesting,
  rolesAsFunction,
  filteredOptions,
  selectedModel,
  sourceOptions,
  selectedModelSource,
  onModelChange,
  onModelSourceChange,
  onSearchModels,
}) => {
  const listRef = useRef<GetRef<typeof Bubble.List>>(null);

  return (
    <Flex vertical className="chat-main-area">
      {/* 消息列表 */}
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
      
      {/* 提示功能 */}
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
      
      {/* 模型选择器区域 */}
      <Space wrap className="model-selector-area">
        <Select
          placeholder="Select a modelSource"
          value={selectedModelSource}
          optionFilterProp="label"
          onChange={onModelSourceChange}
          options={sourceOptions}
          style={{ width: 200 }}
          className="model-select"
        />
        <Select
          showSearch
          placeholder="Select a model"
          value={selectedModel}
          optionFilterProp="label"
          onChange={onModelChange}
          onSearch={onSearchModels}
          options={filteredOptions}
          style={{ width: 300 }}
          className="model-select"
        />
      </Space>

      {/* 消息发送区域 */}
      <Suggestion items={[{ label: "Write a report", value: "report" }]}>
        {({ onTrigger, onKeyDown }) => {
          return (
            <Sender
              value={value}
              loading={isRequesting}
              onChange={(nextVal) => {
                if (nextVal === "/") {
                  onTrigger();
                } else if (!nextVal) {
                  onTrigger(false);
                }
                onValueChange(nextVal);
              }}
              onKeyDown={onKeyDown}
              onSubmit={(nextContent) => {
                onSubmit(nextContent);
                onValueChange("");
              }}
              onCancel={onCancel}
              placeholder='Type "/" to trigger suggestion'
            />
          );
        }}
      </Suggestion>
    </Flex>
  );
};

export default ChatMainArea; 