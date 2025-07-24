import React, { useState, useEffect } from 'react';
import { Card, Button, message, Typography, Descriptions, Space } from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import { MenuConfig } from '../types';
import { menuService } from '../services';

const { Title } = Typography;

export const MenuDetail: React.FC = () => {
  const [menuConfig, setMenuConfig] = useState<MenuConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (id) {
      loadMenuConfig(id);
    }
  }, [id]);

  const loadMenuConfig = async (configId: string) => {
    setLoading(true);
    try {
      const config = await menuService.getById(configId);
      if (config) {
        setMenuConfig(config);
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

  const handleCopyJson = async () => {
    if (!menuConfig) return;

    try {
      await navigator.clipboard.writeText(menuConfig.jsonConfig);
      message.success('JSON配置已复制到剪贴板');
    } catch (error) {
      const textArea = document.createElement('textarea');
      textArea.value = menuConfig.jsonConfig;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      message.success('JSON配置已复制到剪贴板');
    }
  };

  const handleCopyAll = async () => {
    if (!menuConfig) return;

    const copyData = {
      version: menuConfig.version,
      path: menuConfig.path,
      jsonConfig: JSON.parse(menuConfig.jsonConfig),
      createdAt: menuConfig.createdAt,
      updatedAt: menuConfig.updatedAt,
    };

    try {
      await navigator.clipboard.writeText(JSON.stringify(copyData, null, 2));
      message.success('完整配置已复制到剪贴板');
    } catch (error) {
      const textArea = document.createElement('textarea');
      textArea.value = JSON.stringify(copyData, null, 2);
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      message.success('完整配置已复制到剪贴板');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>加载中...</div>
    );
  }

  if (!menuConfig) {
    return (
      <div style={{ padding: '24px', textAlign: 'center' }}>菜单配置不存在</div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div
        style={{
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/')}
            style={{ marginRight: '16px' }}
          >
            返回列表
          </Button>
          <Title level={2} style={{ margin: 0 }}>
            菜单配置详情
          </Title>
        </div>
        <Space>
          <Button icon={<CopyOutlined />} onClick={handleCopyAll}>
            复制全部
          </Button>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => navigate(`/edit/${id}`)}
          >
            编辑配置
          </Button>
        </Space>
      </div>

      <Card style={{ marginBottom: '24px' }}>
        <Descriptions title="基本信息" bordered column={2}>
          <Descriptions.Item label="菜单路径" span={2}>
            {menuConfig.path}
          </Descriptions.Item>
          <Descriptions.Item label="迭代版本号">
            {menuConfig.version}
          </Descriptions.Item>
          <Descriptions.Item label="配置ID">{menuConfig.id}</Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {new Date(menuConfig.createdAt).toLocaleString()}
          </Descriptions.Item>
          <Descriptions.Item label="更新时间">
            {new Date(menuConfig.updatedAt).toLocaleString()}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card
        title={
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>JSON配置</span>
            <Button
              size="small"
              icon={<CopyOutlined />}
              onClick={handleCopyJson}
            >
              复制JSON
            </Button>
          </div>
        }
      >
        <div style={{ border: '1px solid #d9d9d9', borderRadius: '6px' }}>
          <Editor
            height="500px"
            defaultLanguage="json"
            value={menuConfig.jsonConfig}
            options={{
              readOnly: true,
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 14,
              wordWrap: 'on',
              automaticLayout: true,
            }}
            theme="light"
          />
        </div>
      </Card>
    </div>
  );
};
