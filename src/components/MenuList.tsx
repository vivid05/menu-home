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
  Tag,
  Tooltip,
  Avatar,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CopyOutlined,
  FolderOpenOutlined,
  HistoryOutlined,
  SearchOutlined,
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
      title: (
        <span style={{ color: '#1890ff', fontWeight: 'bold' }}>
          <FolderOpenOutlined style={{ marginRight: '8px' }} />
          菜单路径
        </span>
      ),
      dataIndex: 'path',
      key: 'path',
      width: 250,
      render: (path: string) => (
        <span style={{ fontFamily: 'monospace', fontSize: '13px', color: '#666' }}>{path}</span>
      ),
    },
    {
      title: (
        <span style={{ color: '#52c41a', fontWeight: 'bold' }}>
          <HistoryOutlined style={{ marginRight: '8px' }} />
          迭代版本号
        </span>
      ),
      dataIndex: 'version',
      key: 'version',
      width: 160,
      render: (version: string) => (
        <Tag 
          color="green" 
          style={{ 
            borderRadius: '12px',
            fontWeight: 'bold',
            padding: '4px 12px'
          }}
        >
          {version}
        </Tag>
      ),
    },
    {
      title: (
        <span style={{ color: '#fa8c16', fontWeight: 'bold' }}>
          创建时间
        </span>
      ),
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (date: Date) => (
        <span style={{ fontSize: '12px', color: '#666' }}>
          {new Date(date).toLocaleString()}
        </span>
      ),
    },
    {
      title: (
        <span style={{ color: '#fa8c16', fontWeight: 'bold' }}>
          更新时间
        </span>
      ),
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 180,
      render: (date: Date) => (
        <span style={{ fontSize: '12px', color: '#666' }}>
          {new Date(date).toLocaleString()}
        </span>
      ),
    },
    {
      title: (
        <span style={{ color: '#f50', fontWeight: 'bold' }}>
          操作
        </span>
      ),
      key: 'action',
      width: 260,
      render: (_: any, record: MenuConfig) => (
        <Space size="small">
          <Tooltip title="复制JSON配置">
            <Button
              size="small"
              type="primary"
              ghost
              icon={<CopyOutlined />}
              onClick={() => handleCopyJson(record.jsonConfig)}
              style={{
                borderRadius: '8px',
                borderColor: '#1890ff',
                transition: 'all 0.3s ease'
              }}
            >
              复制
            </Button>
          </Tooltip>
          <Tooltip title="编辑配置">
            <Button
              size="small"
              type="primary"
              icon={<EditOutlined />}
              onClick={() => navigate(`/edit/${record.id}`)}
              style={{
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
                border: 'none',
                transition: 'all 0.3s ease'
              }}
            >
              编辑
            </Button>
          </Tooltip>
          <Tooltip title="删除配置">
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id!.toString())}
              style={{
                borderRadius: '8px',
                transition: 'all 0.3s ease'
              }}
            >
              删除
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ 
      padding: '24px',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      minHeight: '100vh'
    }}>
      {/* 头部横幅 */}
      <Card
        style={{ 
          marginBottom: '24px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
          overflow: 'hidden',
          transform: 'translateY(0)',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 12px 40px rgba(102, 126, 234, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 8px 32px rgba(102, 126, 234, 0.3)';
        }}
      >
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '20px'
        }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: '200px' }}>
              <Avatar 
                size={64} 
                style={{ 
                  background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <FolderOpenOutlined style={{ fontSize: '28px', color: 'white' }} />
              </Avatar>
              <div style={{ minWidth: 0 }}>
                <Title level={2} style={{ margin: 0, color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}>
                  菜单配置管理系统
                </Title>
                <p style={{ 
                  color: 'rgba(255, 255, 255, 0.8)', 
                  margin: '4px 0 0 0',
                  fontSize: '14px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  统一管理菜单配置，支持多版本迭代
                </p>
              </div>
            </div>
            <Button
              type="primary"
              size="large"
              icon={<PlusOutlined />}
              onClick={() => navigate('/add')}
              style={{
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.2)',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                backdropFilter: 'blur(10px)',
                color: 'white',
                fontWeight: 'bold',
                height: '48px',
                padding: '0 24px',
                boxShadow: '0 4px 16px rgba(255, 255, 255, 0.2)',
                transition: 'all 0.3s ease',
                flexShrink: 0
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(255, 255, 255, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0px)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(255, 255, 255, 0.2)';
              }}
            >
              新增菜单
            </Button>
          </div>
        </div>

        {/* 筛选控制面板 */}
        <div style={{ 
          marginTop: '20px',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '12px',
          padding: '20px',
          display: 'flex',
          gap: '16px',
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <SearchOutlined style={{ 
            color: 'rgba(255, 255, 255, 0.8)', 
            fontSize: '18px',
            flexShrink: 0
          }} />
          <Select
            placeholder="选择迭代版本号筛选"
            allowClear
            size="large"
            value={selectedVersion}
            onChange={(value) => handleFilter(value || '')}
            style={{ 
              flex: 1,
              minWidth: '200px',
              maxWidth: '400px'
            }}
            dropdownStyle={{
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
            }}
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
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.2)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              transition: 'all 0.3s ease',
              flexShrink: 0
            }}
            onMouseEnter={(e) => {
              const target = e.currentTarget as HTMLButtonElement;
              if (!target.disabled) {
                target.style.transform = 'translateY(-1px)';
                target.style.boxShadow = '0 4px 16px rgba(255, 255, 255, 0.2)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0px)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            批量复制路径
          </Button>
        </div>
      </Card>

      {/* 数据表格 */}
      <Card style={{ 
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
        border: 'none',
        overflow: 'hidden'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #f6f9fc 0%, #ffffff 100%)',
          borderRadius: '12px',
          padding: '4px'
        }}>
          <Table
            columns={columns}
            dataSource={filteredConfigs}
            rowKey="id"
            loading={loading}
            size="middle"
            rowClassName={(_record, index) => 
              index % 2 === 0 ? 'even-row' : 'odd-row'
            }
            pagination={{
              total: filteredConfigs.length,
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => 
                `第 ${range?.[0]}-${range?.[1]} 条，共 ${total} 条记录`,
              style: { 
                marginTop: '20px',
                padding: '0 16px'
              },
            }}
            style={{ 
              borderRadius: '12px',
              background: 'white'
            }}
            scroll={{ x: 1200 }}
          />
        </div>
      </Card>

      <style>{`
        .ant-table-thead > tr > th {
          background: linear-gradient(135deg, #f0f2f5 0%, #fafafa 100%) !important;
          border-bottom: 2px solid #e8e8e8 !important;
          font-weight: 600;
          padding: 16px 12px;
        }
        
        .even-row {
          background-color: #fafafa;
        }
        
        .odd-row {
          background-color: white;
        }
        
        .ant-table-tbody > tr:hover > td {
          background: linear-gradient(135deg, #e6f7ff 0%, #f0f9ff 100%) !important;
          transform: scale(1.01);
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(24, 144, 255, 0.15);
        }
        
        .ant-table-tbody > tr > td {
          padding: 16px 12px;
          border-bottom: 1px solid #f0f0f0;
          transition: all 0.3s ease;
        }
        
        .ant-btn:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        
        .ant-pagination-item {
          border-radius: 8px;
        }
        
        .ant-pagination-item-active {
          background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
          border-color: #1890ff;
        }
        
        /* 响应式样式 */
        @media (max-width: 768px) {
          .ant-table-thead > tr > th {
            padding: 12px 8px;
            font-size: 12px;
          }
          
          .ant-table-tbody > tr > td {
            padding: 12px 8px;
            font-size: 12px;
          }
          
          .ant-card {
            margin: 0 !important;
          }
          
          .ant-space {
            flex-wrap: wrap;
          }
          
          .ant-btn-sm {
            padding: 4px 8px;
            font-size: 11px;
          }
        }
        
        @media (max-width: 480px) {
          .ant-table-thead > tr > th:nth-child(3),
          .ant-table-thead > tr > th:nth-child(4),
          .ant-table-tbody > tr > td:nth-child(3),
          .ant-table-tbody > tr > td:nth-child(4) {
            display: none;
          }
        }
        
        /* 加载动画 */
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .ant-card {
          animation: fadeInUp 0.6s ease-out;
        }
        
        /* 滚动条优化 */
        .ant-table-body::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        .ant-table-body::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        
        .ant-table-body::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }
        
        .ant-table-body::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }
      `}</style>
    </div>
  );
};
