import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Card, message, Typography, Select } from 'antd';
import { SaveOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { menuService } from '../services';

const { Title } = Typography;
const { Option } = Select;

const generateVersionOptions = () => {
  const options = [];
  const currentYear = 2025;

  for (let month = 1; month <= 12; month++) {
    for (let period = 1; period <= 2; period++) {
      const value = `${month}月${period}期`;
      const label = `${currentYear}年${month}月${period}期`;
      options.push({ value: `${currentYear}-${value}`, label });
    }
  }

  return options.sort((a, b) => a.value.localeCompare(b.value));
};

export const MenuForm: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [jsonValue, setJsonValue] = useState('');
  const [jsonError, setJsonError] = useState('');
  const [initialVersion, setInitialVersion] = useState('');
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit && id) {
      loadMenuConfig(id);
    } else {
      // 新增配置时，获取最近一次保存的配置版本号
      loadLatestVersion();
    }
  }, [id, isEdit]);

  const loadLatestVersion = async () => {
    try {
      const configs = await menuService.getAll();
      if (configs.length > 0) {
        // 获取最新的配置（按创建时间排序后的第一个）
        const latestConfig = configs[0];
        setInitialVersion(latestConfig.version);
        form.setFieldsValue({
          version: latestConfig.version,
        });
      }
    } catch (error) {
      console.error('获取最新配置失败:', error);
    }
  };

  const loadMenuConfig = async (configId: string) => {
    setLoading(true);
    try {
      const config = await menuService.getById(configId);
      if (config) {
        form.setFieldsValue({
          version: config.version,
          path: config.path,
        });
        setJsonValue(config.jsonConfig);
      } else {
        message.error('菜单配置不存在');
        navigate('/');
      }
    } catch (error) {
      message.error('加载菜单配置失败');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const validateJson = (jsonString: string): boolean => {
    try {
      JSON.parse(jsonString);
      setJsonError('');
      return true;
    } catch (error) {
      setJsonError('JSON格式不正确');
      return false;
    }
  };

  const handleJsonChange = (value: string | undefined) => {
    const newValue = value || '';
    setJsonValue(newValue);
    if (newValue.trim()) {
      validateJson(newValue);
    } else {
      setJsonError('');
    }
  };

  const handleSubmit = async (values: { version: string; path: string }) => {
    if (!jsonValue.trim()) {
      message.error('请输入菜单JSON配置');
      return;
    }

    let processedJsonValue = jsonValue;
    // 自动将内容中的"hwsj"替换成"touch"
    processedJsonValue = jsonValue.replace(/hwsj/g, 'touch');

    if (!validateJson(processedJsonValue)) {
      message.error('JSON格式不正确，请检查后重试');
      return;
    }

    setLoading(true);
    try {
      if (isEdit && id) {
        await menuService.update(id, {
          ...values,
          jsonConfig: processedJsonValue,
        });
        message.success('更新成功');
      } else {
        await menuService.add({
          ...values,
          jsonConfig: processedJsonValue,
        });
        message.success('保存成功');
      }
      navigate('/');
    } catch (error) {
      message.error(isEdit ? '更新失败' : '保存失败');
    } finally {
      setLoading(false);
    }
  };

  const formatJson = () => {
    try {
      const parsed = JSON.parse(jsonValue);
      const formatted = JSON.stringify(parsed, null, 2);
      setJsonValue(formatted);
      setJsonError('');
      message.success('JSON格式化成功');
    } catch (error) {
      message.error('JSON格式不正确，无法格式化');
    }
  };

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div
          style={{
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/')}
              style={{
                marginRight: '16px',
                borderRadius: '8px',
                border: '1px solid #d9d9d9',
              }}
            >
              返回列表
            </Button>
            <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
              {isEdit ? '✏️ 编辑菜单配置' : '➕ 新增菜单配置'}
            </Title>
          </div>
          <Button
            type="primary"
            onClick={form.submit}
            loading={loading}
            icon={<SaveOutlined />}
            size="large"
            disabled={!!jsonError || !jsonValue.trim()}
            style={{
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
              height: '48px',
              fontSize: '16px',
            }}
          >
            {isEdit ? '更新配置' : '保存配置'}
          </Button>
        </div>

        <Card
          style={{
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            borderRadius: '12px',
          }}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{ version: initialVersion, path: '' }}
          >
            <Form.Item
              label="迭代版本号"
              name="version"
              rules={[{ required: true, message: '请选择迭代版本号' }]}
            >
              <Select
                placeholder="请选择迭代版本号"
                size="large"
                showSearch
                filterOption={(input, option) =>
                  option?.children
                    ?.toString()
                    .toLowerCase()
                    .includes(input.toLowerCase()) || false
                }
                style={{ borderRadius: '8px' }}
              >
                {generateVersionOptions().map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="菜单路径"
              name="path"
              rules={[{ required: true, message: '请输入菜单路径' }]}
            >
              <Input size="large" style={{ borderRadius: '8px' }} />
            </Form.Item>

            <Form.Item
              label={
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span>菜单JSON配置</span>
                  <Button
                    size="small"
                    onClick={formatJson}
                    disabled={!jsonValue.trim()}
                    style={{ borderRadius: '6px' }}
                  >
                    格式化JSON
                  </Button>
                </div>
              }
              required
            >
              <div
                style={{
                  border: '1px solid #d9d9d9',
                  borderRadius: '8px',
                  overflow: 'hidden',
                }}
              >
                <Editor
                  height="600px"
                  defaultLanguage="json"
                  value={jsonValue}
                  onChange={handleJsonChange}
                  options={{
                    minimap: { enabled: false },
                    scrollBeyondLastLine: false,
                    fontSize: 14,
                    wordWrap: 'on',
                    automaticLayout: true,
                  }}
                  theme="light"
                />
              </div>
              {jsonError && (
                <div
                  style={{
                    color: '#ff4d4f',
                    marginTop: '8px',
                    fontSize: '14px',
                  }}
                >
                  ❌ {jsonError}
                </div>
              )}
              {!jsonValue.trim() && (
                <div
                  style={{
                    color: '#ff4d4f',
                    marginTop: '8px',
                    fontSize: '14px',
                  }}
                >
                  ❌ 请输入菜单JSON配置
                </div>
              )}
            </Form.Item>

            {/* 移除了原来的保存按钮 */}
          </Form>
        </Card>
      </div>
    </div>
  );
};
