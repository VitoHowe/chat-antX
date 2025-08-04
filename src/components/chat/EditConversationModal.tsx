/**
 * 编辑对话标题模态框组件
 * 负责对话标题的编辑功能
 */

import React from 'react';
import {
  Modal,
  Input,
} from 'antd';
import type { ConversationItem } from '@/types';

interface EditConversationModalProps {
  /** 是否显示模态框 */
  visible: boolean;
  /** 正在编辑的对话信息 */
  editingConversation: ConversationItem | null;
  /** 保存编辑处理函数 */
  onSave: () => void;
  /** 取消编辑处理函数 */
  onCancel: () => void;
  /** 标题变更处理函数 */
  onLabelChange: (value: string) => void;
}

const EditConversationModal: React.FC<EditConversationModalProps> = ({
  visible,
  editingConversation,
  onSave,
  onCancel,
  onLabelChange,
}) => {
  return (
    <Modal
      title={
        <span className="text-gradient">
          重命名对话
        </span>
      }
      open={visible}
      onOk={onSave}
      onCancel={onCancel}
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
        onChange={(e) => onLabelChange(e.target.value)}
        placeholder="请输入对话标题"
        maxLength={50}
        showCount
        onPressEnter={onSave}
        className="edit-conversation-input"
      />
    </Modal>
  );
};

export default EditConversationModal; 