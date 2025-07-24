import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { MenuList } from './components/MenuList';
import { MenuForm } from './components/MenuForm';
import { MenuDetail } from './components/MenuDetail';
import './App.css';

const App: React.FC = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <Router>
        <div className="app">
          <Routes>
            <Route path="/" element={<MenuList />} />
            <Route path="/add" element={<MenuForm />} />
            <Route path="/edit/:id" element={<MenuForm />} />
            <Route path="/detail/:id" element={<MenuDetail />} />
          </Routes>
        </div>
      </Router>
    </ConfigProvider>
  );
};

export default App;
