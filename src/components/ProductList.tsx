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
import { XRequest, useXAgent } from "@ant-design/x";
interface YourMessageType {
  role: string;
  content: string;
}
export default () => {
  const [value, setValue] = React.useState("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const listRef = React.useRef<GetRef<typeof Bubble.List>>(null);
  const [lines, setLines] = React.useState<Record<string, string>[]>([]);
  const [itemChat, setItemChat] = React.useState<Record<string, string>[]>([]);
  const abortController = useRef<AbortController | null>(null);
  const isFirstRender = useRef(true);
  const [agent] = useXAgent<YourMessageType>({
    baseURL: "https://v2.voct.top/v1/chat/completions",
    model: "gpt-4.1-mini",
    dangerouslyApiKey: "Bearer fo-5ipveme6TFstAW9r-V4_PUj-dV7i78FI",
    /** 🔥🔥 Its dangerously! */
  });
  const exampleRequest = XRequest({
    baseURL: "https://v2.voct.top/v1/chat/completions",
    model: "deepseek-chat",
    dangerouslyApiKey: "Bearer fo-5ipveme6TFstAW9r-V4_PUj-dV7i78FI",
    /** 🔥🔥 Its dangerously! */
  });
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
  const request = async () => {
    // setStatus('pending');
    // 添加用户消息到聊天记录
    setItemChat((pre) => [...pre, { role: "user", content: value }]);

    setValue("");
    setLines([]);
    setLoading(true);
    message.info("Send message!");
    agent.request(
      {
        messages: [{ role: "user", content: value }],
        stream: true,
      },
      {
        onSuccess: () => {
          setLoading(false);
          message.success("Send message successfully!");
        },
        onError: (error) => {
          if (error.name === "AbortError") {
            setLoading(false);
            message.error("Send message AbortError!");
          }
          setLoading(false);
          message.error("Send message Error!");
        },
        onUpdate: (msg) => {
          setLines((pre) => [...pre, msg]);
        },
        onStream: (controller) => {
          abortController.current = controller;
        },
      },
      new TransformStream<string, any>({
        transform(chunk, controller) {
          const DEFAULT_KV_SEPARATOR = "data: ";
          const DEFAULT_STREAM_SEPARATOR = "\n\n";
          const parts = chunk.split(DEFAULT_STREAM_SEPARATOR);

          parts.forEach((part) => {
            const separatorIndex = part.indexOf(DEFAULT_KV_SEPARATOR);
            const value = part.slice(
              separatorIndex + DEFAULT_KV_SEPARATOR.length
            );
            try {
              const modalMessage = JSON.parse(value || "{}");
              const content = modalMessage?.choices?.[0]?.delta?.content || "";
              controller.enqueue(content);
            } catch (error) {
              controller.enqueue("");
            }
          });
        },
      })
    );
    // await exampleRequest.create(
    //   {
    //     messages: [{ role: "user", content: value }],
    //     stream: true,
    //   },
    //   {
    //     onSuccess: () => {
    //       setLoading(false);
    //       message.success("Send message successfully!");
    //       console.log("onSuccess", lines);
    //     },
    //     onError: (error) => {
    //       setLoading(false);
    //       message.success("Send message AbortError!");
    //     },
    //     onUpdate: (msg) => {
    //       // setLines((pre) => [...pre, msg]);
    //       console.log(msg);
    //     },
    //     onStream: (controller) => {
    //       abortController.current = controller;
    //     },
    //   },
    //   new TransformStream<string, string>({
    //     transform(chunk, controller) {
    //       controller.enqueue(chunk);
    //     },
    //   })
    // );
  };
  // Mock send message
  React.useEffect(() => {
    // 跳过首次渲染
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!loading) {
      // 将最新的lines数据格式化为{ role: "ai", content: ... }并添加到itemChat
      const content = lines.join("");
      console.log(content, "content");
      setItemChat((pre) => [...pre, { role: "ai", content }]);
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
              items={itemChat.map((item, i) => {
                return {
                  key: i,
                  role: item.role || "user",
                  content: item.content || "",
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
                      request();
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
