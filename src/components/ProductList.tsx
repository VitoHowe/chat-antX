import React from "react";
import {
  XProvider,
  Bubble,
  Sender,
  Conversations,
  Prompts,
  Suggestion,
  ThoughtChain,
} from "@ant-design/x";
import { Flex, Divider, Radio, Card, Typography, message } from "antd";

import type { ConfigProviderProps, GetProp, GetRef } from "antd";
import {
  AlipayCircleOutlined,
  BulbOutlined,
  GithubOutlined,
  SmileOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { BubbleProps } from "@ant-design/x";
export default () => {
  const [value, setValue] = React.useState("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const listRef = React.useRef<GetRef<typeof Bubble.List>>(null);
  const rolesAsObject: GetProp<typeof Bubble.List, "roles"> = {
    ai: {
      placement: "start",
      avatar: { icon: <UserOutlined />, style: { background: "#fde3cf" } },
      typing: { step: 5, interval: 20 },
      style: {
        maxWidth: 600,
      },
    },
    user: {
      placement: "end",
      avatar: { icon: <UserOutlined />, style: { background: "#87d068" } },
    },
  };
  const rolesAsFunction = (bubbleData: BubbleProps, index: number) => {
    const RenderIndex: BubbleProps["messageRender"] = (content) => (
      <Flex>
        #{index}: {content}
      </Flex>
    );
    switch (bubbleData.role) {
      case "ai":
        return {
          placement: "start" as const,
          avatar: { icon: <UserOutlined />, style: { background: "#fde3cf" } },
          typing: { step: 5, interval: 20 },
          style: {
            maxWidth: 600,
          },
          messageRender: RenderIndex,
        };
      case "user":
        return {
          placement: "end" as const,
          avatar: { icon: <UserOutlined />, style: { background: "#87d068" } },
          messageRender: RenderIndex,
        };
      default:
        return { messageRender: RenderIndex };
    }
  };
  // Mock send message
  React.useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setLoading(false);
        message.success("Send message successfully!");
      }, 3000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [loading]);
  return (
    <>
      <XProvider>
        <Flex
          style={{
            height: "100vh",
            backgroundColor: "#f5f5f5",
            padding: "16px",
          }}
          gap={12}
        >
          <Conversations
            style={{
              width: 200,
              backgroundColor: "#fff",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              marginRight: 0,
            }}
            defaultActiveKey="1"
            items={[
              {
                key: "1",
                label: "Conversation - 1",
                icon: <GithubOutlined />,
              },
            ]}
          />
          <Divider type="vertical" style={{ height: "100%" }} />
          <Flex
            vertical
            style={{
              flex: 1,
              overflow: "hidden",
              backgroundColor: "#fff",
              borderRadius: "8px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              padding: "16px",
            }}
            gap={8}
          >
            <Bubble.List
              ref={listRef}
              style={{
                flex: 1,
                overflow: "auto",
                paddingInline: 16,
                scrollBehavior: "smooth",
              }}
              roles={rolesAsFunction}
              items={Array.from({ length: 4 }).map((_, i) => {
                const isAI = !!(i % 2);
                const content = isAI
                  ? "Mock AI content. ".repeat(20)
                  : "Mock user content.";

                return { key: i, role: isAI ? "ai" : "user", content };
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
            <Suggestion items={[{ label: "Write a report", value: "report" }]}>
              {({ onTrigger, onKeyDown }) => {
                return (
                  <Sender
                    value={value}
                    loading={loading}
                    onChange={(nextVal) => {
                      if (nextVal === "/") {
                        onTrigger();
                      } else if (!nextVal) {
                        onTrigger(false);
                      }
                      setValue(nextVal);
                    }}
                    onKeyDown={onKeyDown}
                    onSubmit={() => {
                      setValue("");
                      setLoading(true);
                      message.info("Send message!");
                    }}
                    onCancel={() => {
                      setLoading(false);
                      message.error("Cancel sending!");
                    }}
                    placeholder='Type "/" to trigger suggestion'
                  />
                );
              }}
            </Suggestion>
          </Flex>
        </Flex>
        <ThoughtChain />
      </XProvider>
    </>
  );
};
