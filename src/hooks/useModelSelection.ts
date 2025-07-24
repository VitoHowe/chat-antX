/**
 * 模型选择自定义Hook
 * 封装模型源和模型的获取与选择逻辑
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { message } from 'antd';
import { ApiService } from '@/services/api.service';
import type { ModelOption } from '@/types';

export const useModelSelection = () => {
  // 模型相关状态
  const [modelOptions, setModelOptions] = useState<ModelOption[]>([]);
  const [filteredOptions, setFilteredOptions] = useState<ModelOption[]>([]);
  const [selectedModel, setSelectedModel] = useState<string>("gpt-4.1-mini");
  
  // 模型源相关状态
  const [selectedModelSource, setSelectedModelSource] = useState<string>("");
  const [sourceOptions, setSourceOptions] = useState<ModelOption[]>([]);
  
  // 加载状态
  const [loading, setLoading] = useState({
    sources: false,
    models: false,
  });

  // 获取模型源列表
  const fetchModelSources = useCallback(async () => {
    setLoading(prev => ({ ...prev, sources: true }));
    try {
      const sources = await ApiService.getModelSources();

      if (sources.length > 0) {
        const options = sources.map((item) => ({
          value: String(item.type),
          label: item.name,
        }));

        setSourceOptions(options);

        // 默认选择第一个
        if (options.length > 0) {
          setSelectedModelSource(options[0].value);
        }
      }
    } catch (error) {
      console.error("获取模型源列表失败:", error);
      message.error("获取模型源列表失败");
    } finally {
      setLoading(prev => ({ ...prev, sources: false }));
    }
  }, []);

  // 获取模型列表
  const fetchModels = useCallback(async (sourceType: string) => {
    if (!sourceType) return;

    setLoading(prev => ({ ...prev, models: true }));
    // 重置模型选择
    setSelectedModel("");
    setFilteredOptions([]);

    try {
      const models = await ApiService.getModels(sourceType);
      if (Array.isArray(models) && models.length > 0) {
        const options = models.map((item) => ({
          value: item.id,
          label: item.id,
        }));

        setModelOptions(options);
        setFilteredOptions(options);

        // 默认选择第一个
        if (options.length > 0) {
          setSelectedModel(options[0].value);
        }
      }
    } catch (error) {
      console.error("获取模型列表失败:", error);
      message.error("获取模型列表失败");
    } finally {
      setLoading(prev => ({ ...prev, models: false }));
    }
  }, []);

  // 搜索模型
  const searchModels = useCallback((value: string) => {
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
  }, [modelOptions]);

  // 切换模型源
  const changeModelSource = useCallback((value: string) => {
    setSelectedModelSource(value);
  }, []);

  // 切换模型
  const changeModel = useCallback((value: string) => {
    setSelectedModel(value);
  }, []);

  // 初始化获取模型源
  useEffect(() => {
    fetchModelSources();
  }, [fetchModelSources]);

  // 当模型源变化时获取模型列表
  useEffect(() => {
    if (selectedModelSource) {
      fetchModels(selectedModelSource);
    }
  }, [selectedModelSource, fetchModels]);

  // 计算是否正在加载
  const isLoading = useMemo(() => 
    loading.sources || loading.models, 
    [loading.sources, loading.models]
  );

  return {
    // 模型相关
    modelOptions,
    filteredOptions,
    selectedModel,
    changeModel,
    searchModels,
    
    // 模型源相关
    sourceOptions,
    selectedModelSource,
    changeModelSource,
    
    // 状态
    loading,
    isLoading,
    
    // 操作方法
    fetchModelSources,
    fetchModels,
  };
}; 