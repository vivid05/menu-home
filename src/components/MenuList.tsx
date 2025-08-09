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
  const currentYear = new Date().getFullYear();

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
  const [selectedVersion, setSelectedVersion] = useState<string>('');
  const navigate = useNavigate();

  // 获取当前月份的1期版本
  const getCurrentMonthFirstPeriod = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // getMonth() 返回 0-11，所以需要 +1
    return `${currentYear}-${currentMonth}月1期`;
  };

  useEffect(() => {
    const initializeData = async () => {
      await loadMenuConfigs();
      // 数据加载完成后设置默认选中当前月的1期
      const defaultVersion = getCurrentMonthFirstPeriod();
      setSelectedVersion(defaultVersion);
      handleFilter(defaultVersion);
    };
    initializeData();
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

  const handleFilter = async (value: string, configs?: MenuConfig[]) => {
    setSelectedVersion(value);
    if (!value) {
      const currentConfigs = configs || menuConfigs;
      setFilteredConfigs(currentConfigs);
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

  const handleBatchCopyPaths = async () => {
    if (!selectedVersion) {
      message.warning('请先选择一个迭代版本');
      return;
    }

    try {
      // 获取当前筛选版本的所有配置
      const configs = filteredConfigs.length > 0 ? filteredConfigs : await menuService.searchByVersion(selectedVersion);
      
      // 存储所有路径
      const paths: string[] = [];
      
      // 遍历每个配置
      for (const config of configs) {
        try {
          // 解析JSON配置
          const json = JSON.parse(config.jsonConfig);
          
          // 只遍历resourceMultilingualList数组，且resourcetype为1时才遍历
          const extractNames = (obj: any, basePath: string = config.path) => {
            if (typeof obj === 'object' && obj !== null) {
              // 检查是否有resourceMultilingualList数组和resourcetype字段
              if (obj.resourceMultilingualList && Array.isArray(obj.resourceMultilingualList) && obj.resourcetype === 1) {
                obj.resourceMultilingualList.forEach((item: any) => {
                  if (item && typeof item === 'object' && item.name) {
                    paths.push(`${basePath}//${item.name}`);
                  }
                  // 递归处理resourceMultilingualList中的每个项目
                  extractNames(item, basePath);
                });
              }
              
              // 继续遍历对象的其他属性以查找更多的resourceMultilingualList
              Object.keys(obj).forEach(key => {
                if (typeof obj[key] === 'object' && obj[key] !== null) {
                  extractNames(obj[key], basePath);
                }
              });
            }
          };
          
          extractNames(json);
        } catch (parseError) {
          console.error(`解析配置ID ${config.id} 的JSON时出错:`, parseError);
        }
      }
      
      // 复制到剪贴板
      const result = paths.join('\n');
      await navigator.clipboard.writeText(result);
      message.success(`已复制 ${paths.length} 条路径到剪贴板`);
    } catch (error) {
      console.error('批量复制路径失败:', error);
      message.error('批量复制路径失败');
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

        <div style={{ marginBottom: '20px', display: 'flex', gap: '16px' }}>
          <Select
            placeholder="🔍 请选择迭代版本号筛选"
            allowClear
            size="large"
            value={selectedVersion}
            onChange={(value) => handleFilter(value || '')}
            style={{ width: 400 }}
          >
            {generateVersionOptions().map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
          <Button
            type="primary"
            size="large"
            icon={<CopyOutlined />}
            onClick={handleBatchCopyPaths}
            disabled={!selectedVersion}
            style={{
              borderRadius: '8px',
            }}
          >
            批量复制路径
          </Button>
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
