import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  message,
  Modal,
  Typography,
  Card,
  Select,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { MenuConfig } from '../types';
import { menuService } from '../services';

const { confirm } = Modal;
const { Title } = Typography;
const { Option } = Select;

const generateVersionOptions = () => {
  const options = [{ value: '', label: '全部版本' }];
  const currentYear = 2025;

  for (let month = 1; month <= 12; month++) {
    for (let period = 1; period <= 2; period++) {
      const value = `${currentYear}-${month}月${period}期`;
      const label = `${currentYear}年${month}月${period}期`;
      options.push({ value, label });
    }
  }

  return options;
};

export const MenuList: React.FC = () => {
  const [menuConfigs, setMenuConfigs] = useState<MenuConfig[]>([]);
  const [filteredConfigs, setFilteredConfigs] = useState<MenuConfig[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadMenuConfigs();
  }, []);

  const loadMenuConfigs = async () => {
    setLoading(true);
    try {
      const configs = await menuService.getAll();
      setMenuConfigs(configs);
      setFilteredConfigs(configs);
    } catch (error) {
      message.error('加载菜单配置失败');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async (value: string) => {
    if (!value) {
      setFilteredConfigs(menuConfigs);
      return;
    }

    try {
      const searchResults = await menuService.searchByVersion(value);
      setFilteredConfigs(searchResults);
    } catch (error) {
      message.error('筛选失败');
    }
  };

  const handleCopyJson = async (jsonConfig: string) => {
    try {
      await navigator.clipboard.writeText(jsonConfig);
      message.success('JSON配置已复制到剪贴板');
    } catch (error) {
      const textArea = document.createElement('textarea');
      textArea.value = jsonConfig;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      message.success('JSON配置已复制到剪贴板');
    }
  };

  const handleDelete = (id: string) => {
    confirm({
      title: '确认删除',
      content: '确定要删除这个菜单配置吗？',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await menuService.delete(id);
          message.success('删除成功');
          loadMenuConfigs();
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  const columns = [
    {
      title: '菜单路径',
      dataIndex: 'path',
      key: 'path',
      width: 250,
    },
    {
      title: '迭代版本号',
      dataIndex: 'version',
      key: 'version',
      width: 150,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (date: Date) => new Date(date).toLocaleString(),
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 180,
      render: (date: Date) => new Date(date).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      width: 240,
      render: (_: any, record: MenuConfig) => (
        <Space size="small">
          <Button
            size="small"
            icon={<CopyOutlined />}
            onClick={() => handleCopyJson(record.jsonConfig)}
          >
            复制JSON
          </Button>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => navigate(`/edit/${record.id}`)}
          >
            编辑
          </Button>
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id!.toString())}
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
      <Card
        style={{ marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
          }}
        >
          <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
            📋 菜单配置管理系统
          </Title>
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => navigate('/add')}
            style={{
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
            }}
          >
            新增菜单
          </Button>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <Select
            placeholder="🔍 请选择迭代版本号筛选"
            allowClear
            size="large"
            onChange={handleFilter}
            style={{ width: 400 }}
          >
            {generateVersionOptions().map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </div>
      </Card>

      <Card style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <Table
          columns={columns}
          dataSource={filteredConfigs}
          rowKey="id"
          loading={loading}
          pagination={{
            total: filteredConfigs.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => `共 ${total} 条记录`,
            style: { marginTop: '16px' },
          }}
          style={{ borderRadius: '8px' }}
        />
      </Card>
    </div>
  );
};
