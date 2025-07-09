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
import { Flex, Divider, Radio, Card, Typography, message, Select } from "antd";

import type { ConfigProviderProps, GetProp, GetRef } from "antd";
import {
  AlipayCircleOutlined,
  BulbOutlined,
  GithubOutlined,
  SmileOutlined,
  UserOutlined,
} from "@ant-design/icons";
import type { BubbleProps } from "@ant-design/x";
import { useXAgent, useXChat } from "@ant-design/x";
import { API_CONFIG } from "../config/api";

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
  const [modelOptions, setModelOptions] = React.useState<
    { value: string; label: string }[]
  >([]);
  const [filteredOptions, setFilteredOptions] = React.useState<
    { value: string; label: string }[]
  >([]);
  const [selectedModel, setSelectedModel] =
    React.useState<string>("gpt-4.1-mini");
  const abortController = useRef<AbortController | null>(null);
  const isFirstRender = useRef(true);

  const onChange = (value: string) => {
    // console.log(`selected ${value}`);
    setSelectedModel(value);
  };

  const onSearch = (value: string) => {
    // console.log("search:", value);
    if (!value) {
      setFilteredOptions(modelOptions);
    } else {
      const filtered = modelOptions.filter(
        (option) =>
          option.label.toLowerCase().includes(value.toLowerCase()) ||
          option.value.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
  };
  const [agent] = useXAgent<YourMessageType>({
    baseURL: API_CONFIG.baseURL,
    model: selectedModel,
    dangerouslyApiKey: API_CONFIG.apiKey,
    /** 🔥🔥 Its dangerously! */
  });
  const { onRequest, messages } = useXChat({
    agent,
    requestFallback: (_, { error }) => {
      if (error.name === "AbortError") {
        return {
          content: "Request is aborted",
          role: "assistant",
        };
      }
      return {
        content: "Request failed, please try again!",
        role: "assistant",
      };
    },
    requestPlaceholder: () => {
      return {
        content: "Please wait...",
        role: "assistant",
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
        role: "assistant",
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

  // Mock send message
  React.useEffect(() => {
    fetch(API_CONFIG.baseModelURL, {
      method: "GET",
      headers: {
        Authorization: API_CONFIG.apiKey,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // 将API数据转换为Select组件需要的格式;
        if (data && data.data && Array.isArray(data.data)) {
          const options = data.data.map((item: any, index: number) => ({
            value: item.root || item.id,
            label: item.id || item.root,
          }));
          setModelOptions(options);
          setFilteredOptions(options); // 初始化过滤选项
        }
      })
      .catch((error) => console.error("Error:", error));

    // fetch("http://localhost:3000/api/users", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     username: "JohnDoe",
    //     password: "123456",
    //     email: "john.doe@example.com",
    //   }),
    // })
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log(data);
    //   })
    //   .catch((error) => console.error("Error:", error));
  }, []);

  React.useEffect(() => {
    // 跳过首次渲染
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    // if (!loading) {
    //   // 将最新的lines数据格式化为{ role: "assistant", content: ... }并添加到itemChat
    //   const content = lines.join("");
    //   console.log(content, "content");
    //   setItemChat((pre) => [...pre, { role: "assistant", content }]);
    // }
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
            <Select
              showSearch
              placeholder="Select a model"
              value={selectedModel}
              optionFilterProp="label"
              onChange={onChange}
              onSearch={onSearch}
              options={filteredOptions}
              style={{ width: 300 }}
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
                    onSubmit={(content) => {
                      onRequest({
                        stream: true,
                        message: {
                          role: "user",
                          content: content,
                        },
                      });
                      setValue("");
                    }}
                    onCancel={() => {
                      setLoading(false);
                      abortController?.current?.abort?.();
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
