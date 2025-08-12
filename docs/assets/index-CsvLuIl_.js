var K=Object.defineProperty;var Q=(r,s,o)=>s in r?K(r,s,{enumerable:!0,configurable:!0,writable:!0,value:o}):r[s]=o;var V=(r,s,o)=>Q(r,typeof s!="symbol"?s+"":s,o);import{r as h,j as e,a as _}from"./react-BwYbncKq.js";import{c as G}from"./react-dom-CYoFxZK3.js";import{T as D,S as z,C as R,A as X,B as m,F as Z,s as p,a as ee,b as Y,c as B,M as te,d as I,I as re,D as k,e as ne,z as ae}from"./antd-DewWXLPD.js";import{D as se}from"./dexie-CHToNQ8G.js";import{u as F,a as P,B as oe,R as ie,b as A}from"./react-router-DIMhQKeV.js";import{G as E,t as le,n as de,P as $,T as ce,Q as q,U as pe,V as U,W as xe}from"./@ant-design-DRTVksVb.js";import{F as H}from"./@monaco-editor-BdY340vY.js";import"./@babel-C_SyoEfJ.js";import"./scheduler-DYLXRpC5.js";import"./rc-util-qpEr0zEL.js";import"./react-is-DcAOwtUU.js";import"./classnames-C6I1OsXt.js";import"./rc-resize-observer-Djs7foYh.js";import"./resize-observer-polyfill-B1PUzC5B.js";import"./rc-motion-fdt2-AWL.js";import"./@rc-component-BR_ngAOY.js";import"./rc-tooltip-pjaaGmtY.js";import"./rc-overflow-BSjmwJ5L.js";import"./rc-tabs-BHA9lPzR.js";import"./rc-dropdown-Cndduivm.js";import"./rc-menu-leSD-9x-.js";import"./rc-select-CHT1FDbn.js";import"./rc-virtual-list-Bi_WoJXF.js";import"./rc-field-form-DllQAnfV.js";import"./rc-dialog-DM7j7U3l.js";import"./rc-notification-Bk_9v6gO.js";import"./rc-table-DHKB8nZW.js";import"./rc-tree-BGBWsLK6.js";import"./rc-checkbox-gkqbq-se.js";import"./scroll-into-view-if-needed-Bq0bK-M8.js";import"./compute-scroll-into-view-Bl8rNFhg.js";import"./rc-pagination-Bvz_Ru-I.js";import"./throttle-debounce-CUWDS_la.js";import"./rc-input-DdsdxYUa.js";import"./rc-picker-ctJ4hI_D.js";import"./rc-textarea-7R1xcK0F.js";import"./copy-to-clipboard-DhLP-jDv.js";import"./toggle-selection-BHUZwh74.js";import"./@emotion-CW87jbl0.js";import"./stylis-D5iaQeiq.js";import"./state-local-BBNhjlcY.js";(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))a(i);new MutationObserver(i=>{for(const d of i)if(d.type==="childList")for(const u of d.addedNodes)u.tagName==="LINK"&&u.rel==="modulepreload"&&a(u)}).observe(document,{childList:!0,subtree:!0});function o(i){const d={};return i.integrity&&(d.integrity=i.integrity),i.referrerPolicy&&(d.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?d.credentials="include":i.crossOrigin==="anonymous"?d.credentials="omit":d.credentials="same-origin",d}function a(i){if(i.ep)return;i.ep=!0;const d=o(i);fetch(i.href,d)}})();class ue extends se{constructor(){super("MenuDatabase");V(this,"menuConfigs");this.version(1).stores({menuConfigs:"++id, version, name, createdAt, updatedAt"})}}const w=new ue,j={async getAll(){return w.menuConfigs.orderBy("createdAt").reverse().toArray()},async getById(r){return w.menuConfigs.get(Number(r))},async searchByVersion(r){return w.menuConfigs.where("version").startsWithIgnoreCase(r).reverse().sortBy("createdAt")},async add(r){const s=new Date;return w.menuConfigs.add({...r,createdAt:s,updatedAt:s})},async update(r,s){await w.menuConfigs.update(Number(r),{...s,updatedAt:new Date})},async delete(r){await w.menuConfigs.delete(Number(r))},async deleteByVersion(r){const o=(await this.searchByVersion(r)).map(a=>a.id);await w.menuConfigs.bulkDelete(o)},async exportAll(){return this.getAll()},async importConfigs(r){await w.menuConfigs.bulkAdd(r.map(s=>({...s,id:void 0})))}},{confirm:fe}=te,{Title:he}=D,{Option:ge}=z,me=()=>{const r=[{value:"",label:"全部版本"}],s=new Date().getFullYear();for(let o=1;o<=12;o++)for(let a=1;a<=2;a++){const i=`${s}-${o}月${a}期`,d=`${s}年${o}月${a}期`;r.push({value:i,label:d})}return r},ye=()=>{const[r,s]=h.useState([]),[o,a]=h.useState([]),[i,d]=h.useState(!1),[u,S]=h.useState(""),C=F(),g=()=>{const t=new Date,l=t.getFullYear(),n=t.getMonth()+1;return`${l}-${n}月1期`};h.useEffect(()=>{(async()=>{await x();const l=g();S(l),f(l)})()},[]);const x=async()=>{d(!0);try{const t=await j.getAll();s(t),a(t)}catch{p.error("加载菜单配置失败")}finally{d(!1)}},f=async(t,l)=>{if(S(t),!t){a(r);return}try{const n=await j.searchByVersion(t);a(n)}catch{p.error("筛选失败")}},N=async t=>{try{await navigator.clipboard.writeText(t),p.success("JSON配置已复制到剪贴板")}catch{const n=document.createElement("textarea");n.value=t,document.body.appendChild(n),n.select(),document.execCommand("copy"),document.body.removeChild(n),p.success("JSON配置已复制到剪贴板")}},T=async()=>{if(!u){p.warning("请先选择一个迭代版本");return}try{const t=o.length>0?o:await j.searchByVersion(u),l=[];for(const c of t)try{const v=JSON.parse(c.jsonConfig),L=(y,M=c.path)=>{typeof y=="object"&&y!==null&&(y.resourceMultilingualList&&Array.isArray(y.resourceMultilingualList)&&y.resourcetype===1&&y.resourceMultilingualList.forEach(b=>{b&&typeof b=="object"&&b.name&&l.push(`${M}//${b.name}`),L(b,M)}),Object.keys(y).forEach(b=>{typeof y[b]=="object"&&y[b]!==null&&L(y[b],M)}))};L(v)}catch(v){console.error(`解析配置ID ${c.id} 的JSON时出错:`,v)}const n=l.join(`
`);await navigator.clipboard.writeText(n),p.success(`已复制 ${l.length} 条路径到剪贴板`)}catch(t){console.error("批量复制路径失败:",t),p.error("批量复制路径失败")}},O=t=>{fe({title:"确认删除",content:"确定要删除这个菜单配置吗？",okText:"删除",okType:"danger",cancelText:"取消",onOk:async()=>{try{await j.delete(t),p.success("删除成功"),x()}catch{p.error("删除失败")}}})},J=[{title:e.jsxs("span",{style:{color:"#1890ff",fontWeight:"bold"},children:[e.jsx(E,{style:{marginRight:"8px"}}),"菜单路径"]}),dataIndex:"path",key:"path",width:250,render:t=>e.jsx("span",{style:{fontFamily:"monospace",fontSize:"13px",color:"#666"},children:t})},{title:e.jsxs("span",{style:{color:"#52c41a",fontWeight:"bold"},children:[e.jsx(ce,{style:{marginRight:"8px"}}),"迭代版本号"]}),dataIndex:"version",key:"version",width:160,render:t=>e.jsx(ee,{color:"green",style:{borderRadius:"12px",fontWeight:"bold",padding:"4px 12px"},children:t})},{title:e.jsx("span",{style:{color:"#fa8c16",fontWeight:"bold"},children:"创建时间"}),dataIndex:"createdAt",key:"createdAt",width:180,render:t=>e.jsx("span",{style:{fontSize:"12px",color:"#666"},children:new Date(t).toLocaleString()})},{title:e.jsx("span",{style:{color:"#fa8c16",fontWeight:"bold"},children:"更新时间"}),dataIndex:"updatedAt",key:"updatedAt",width:180,render:t=>e.jsx("span",{style:{fontSize:"12px",color:"#666"},children:new Date(t).toLocaleString()})},{title:e.jsx("span",{style:{color:"#f50",fontWeight:"bold"},children:"操作"}),key:"action",width:260,render:(t,l)=>e.jsxs(Y,{size:"small",children:[e.jsx(B,{title:"复制JSON配置",children:e.jsx(m,{size:"small",type:"primary",ghost:!0,icon:e.jsx($,{}),onClick:()=>N(l.jsonConfig),style:{borderRadius:"8px",borderColor:"#1890ff",transition:"all 0.3s ease"},children:"复制"})}),e.jsx(B,{title:"编辑配置",children:e.jsx(m,{size:"small",type:"primary",icon:e.jsx(q,{}),onClick:()=>C(`/edit/${l.id}`),style:{borderRadius:"8px",background:"linear-gradient(135deg, #52c41a 0%, #73d13d 100%)",border:"none",transition:"all 0.3s ease"},children:"编辑"})}),e.jsx(B,{title:"删除配置",children:e.jsx(m,{size:"small",danger:!0,icon:e.jsx(pe,{}),onClick:()=>O(l.id.toString()),style:{borderRadius:"8px",transition:"all 0.3s ease"},children:"删除"})})]})}];return e.jsxs("div",{style:{padding:"24px",background:"linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",minHeight:"100vh"},children:[e.jsxs(R,{style:{marginBottom:"24px",background:"linear-gradient(135deg, #667eea 0%, #764ba2 100%)",border:"none",borderRadius:"16px",boxShadow:"0 8px 32px rgba(102, 126, 234, 0.3)",overflow:"hidden",transform:"translateY(0)",transition:"all 0.3s ease"},onMouseEnter:t=>{t.currentTarget.style.transform="translateY(-2px)",t.currentTarget.style.boxShadow="0 12px 40px rgba(102, 126, 234, 0.4)"},onMouseLeave:t=>{t.currentTarget.style.transform="translateY(0)",t.currentTarget.style.boxShadow="0 8px 32px rgba(102, 126, 234, 0.3)"},children:[e.jsx("div",{style:{background:"rgba(255, 255, 255, 0.1)",backdropFilter:"blur(10px)",borderRadius:"12px",padding:"20px"},children:e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",flexWrap:"wrap",gap:"16px"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:"16px",flex:1,minWidth:"200px"},children:[e.jsx(X,{size:64,style:{background:"linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0},children:e.jsx(E,{style:{fontSize:"28px",color:"white"}})}),e.jsxs("div",{style:{minWidth:0},children:[e.jsx(he,{level:2,style:{margin:0,color:"white",textShadow:"0 2px 4px rgba(0,0,0,0.3)"},children:"菜单配置管理系统"}),e.jsx("p",{style:{color:"rgba(255, 255, 255, 0.8)",margin:"4px 0 0 0",fontSize:"14px",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"},children:"统一管理菜单配置，支持多版本迭代"})]})]}),e.jsx(m,{type:"primary",size:"large",icon:e.jsx(le,{}),onClick:()=>C("/add"),style:{borderRadius:"12px",background:"rgba(255, 255, 255, 0.2)",border:"1px solid rgba(255, 255, 255, 0.3)",backdropFilter:"blur(10px)",color:"white",fontWeight:"bold",height:"48px",padding:"0 24px",boxShadow:"0 4px 16px rgba(255, 255, 255, 0.2)",transition:"all 0.3s ease",flexShrink:0},onMouseEnter:t=>{t.currentTarget.style.transform="translateY(-2px)",t.currentTarget.style.boxShadow="0 6px 20px rgba(255, 255, 255, 0.3)"},onMouseLeave:t=>{t.currentTarget.style.transform="translateY(0px)",t.currentTarget.style.boxShadow="0 4px 16px rgba(255, 255, 255, 0.2)"},children:"新增菜单"})]})}),e.jsxs("div",{style:{marginTop:"20px",background:"rgba(255, 255, 255, 0.1)",backdropFilter:"blur(10px)",borderRadius:"12px",padding:"20px",display:"flex",gap:"16px",alignItems:"center",flexWrap:"wrap"},children:[e.jsx(de,{style:{color:"rgba(255, 255, 255, 0.8)",fontSize:"18px",flexShrink:0}}),e.jsx(z,{placeholder:"选择迭代版本号筛选",allowClear:!0,size:"large",value:u,onChange:t=>f(t||""),style:{flex:1,minWidth:"200px",maxWidth:"400px"},dropdownStyle:{borderRadius:"12px",boxShadow:"0 8px 32px rgba(0,0,0,0.15)"},children:me().map(t=>e.jsx(ge,{value:t.value,children:t.label},t.value))}),e.jsx(m,{type:"primary",size:"large",icon:e.jsx($,{}),onClick:T,disabled:!u,style:{borderRadius:"12px",background:"rgba(255, 255, 255, 0.2)",border:"1px solid rgba(255, 255, 255, 0.3)",backdropFilter:"blur(10px)",color:"white",transition:"all 0.3s ease",flexShrink:0},onMouseEnter:t=>{const l=t.currentTarget;l.disabled||(l.style.transform="translateY(-1px)",l.style.boxShadow="0 4px 16px rgba(255, 255, 255, 0.2)")},onMouseLeave:t=>{t.currentTarget.style.transform="translateY(0px)",t.currentTarget.style.boxShadow="none"},children:"批量复制路径"})]})]}),e.jsx(R,{style:{borderRadius:"16px",boxShadow:"0 8px 32px rgba(0,0,0,0.08)",border:"none",overflow:"hidden"},children:e.jsx("div",{style:{background:"linear-gradient(135deg, #f6f9fc 0%, #ffffff 100%)",borderRadius:"12px",padding:"4px"},children:e.jsx(Z,{columns:J,dataSource:o,rowKey:"id",loading:i,size:"middle",rowClassName:(t,l)=>l%2===0?"even-row":"odd-row",pagination:{total:o.length,pageSize:10,showSizeChanger:!0,showQuickJumper:!0,showTotal:(t,l)=>`第 ${l==null?void 0:l[0]}-${l==null?void 0:l[1]} 条，共 ${t} 条记录`,style:{marginTop:"20px",padding:"0 16px"}},style:{borderRadius:"12px",background:"white"},scroll:{x:1200}})})}),e.jsx("style",{children:`
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
      `})]})},{Title:be}=D,{Option:je}=z,we=()=>{const r=[],s=new Date().getFullYear();for(let o=1;o<=12;o++)for(let a=1;a<=2;a++){const i=`${o}月${a}期`,d=`${s}年${o}月${a}期`;r.push({value:`${s}-${i}`,label:d})}return r.sort((o,a)=>o.value.localeCompare(a.value))},W=()=>{const[r]=I.useForm(),[s,o]=h.useState(!1),[a,i]=h.useState(""),[d,u]=h.useState(""),[S,C]=h.useState(""),g=F(),{id:x}=P(),f=!!x;h.useEffect(()=>{f&&x?T(x):N()},[x,f]);const N=async()=>{try{const n=await j.getAll();if(n.length>0){const c=n[0];C(c.version),r.setFieldsValue({version:c.version})}}catch(n){console.error("获取最新配置失败:",n)}},T=async n=>{o(!0);try{const c=await j.getById(n);c?(r.setFieldsValue({version:c.version,path:c.path}),i(c.jsonConfig)):(p.error("菜单配置不存在"),g("/"))}catch{p.error("加载菜单配置失败"),g("/")}finally{o(!1)}},O=n=>{try{return JSON.parse(n),u(""),!0}catch{return u("JSON格式不正确"),!1}},J=n=>{const c=n||"";i(c),c.trim()?O(c):u("")},t=async n=>{if(!a.trim()){p.error("请输入菜单JSON配置");return}let c=a;if(c=a.replace(/hwsj/g,"touch"),!O(c)){p.error("JSON格式不正确，请检查后重试");return}o(!0);try{f&&x?(await j.update(x,{...n,jsonConfig:c}),p.success("更新成功")):(await j.add({...n,jsonConfig:c}),p.success("保存成功")),g("/")}catch{p.error(f?"更新失败":"保存失败")}finally{o(!1)}},l=()=>{try{const n=JSON.parse(a),c=JSON.stringify(n,null,2);i(c),u(""),p.success("JSON格式化成功")}catch{p.error("JSON格式不正确，无法格式化")}};return e.jsx("div",{style:{padding:"24px",background:"#f5f5f5",minHeight:"100vh"},children:e.jsxs("div",{style:{maxWidth:"1200px",margin:"0 auto"},children:[e.jsxs("div",{style:{marginBottom:"24px",display:"flex",alignItems:"center",justifyContent:"space-between"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center"},children:[e.jsx(m,{icon:e.jsx(U,{}),onClick:()=>g("/"),style:{marginRight:"16px",borderRadius:"8px",border:"1px solid #d9d9d9"},children:"返回列表"}),e.jsx(be,{level:2,style:{margin:0,color:"#1890ff"},children:f?"✏️ 编辑菜单配置":"➕ 新增菜单配置"})]}),e.jsx(m,{type:"primary",onClick:r.submit,loading:s,icon:e.jsx(xe,{}),size:"large",disabled:!!d||!a.trim(),style:{borderRadius:"8px",background:d||!a.trim()?"#d9d9d9":"linear-gradient(135deg, #667eea 0%, #764ba2 100%)",border:"none",boxShadow:"0 4px 12px rgba(102, 126, 234, 0.4)",height:"48px",fontSize:"16px",color:d||!a.trim()?"#666666":"#ffffff"},children:f?"更新配置":"保存配置"})]}),e.jsx(R,{style:{boxShadow:"0 2px 8px rgba(0,0,0,0.1)",borderRadius:"12px"},children:e.jsxs(I,{form:r,layout:"vertical",onFinish:t,initialValues:{version:S,path:""},children:[e.jsx(I.Item,{label:"迭代版本号",name:"version",rules:[{required:!0,message:"请选择迭代版本号"}],children:e.jsx(z,{placeholder:"请选择迭代版本号",size:"large",showSearch:!0,filterOption:(n,c)=>{var v;return((v=c==null?void 0:c.children)==null?void 0:v.toString().toLowerCase().includes(n.toLowerCase()))||!1},style:{borderRadius:"8px"},children:we().map(n=>e.jsx(je,{value:n.value,children:n.label},n.value))})}),e.jsx(I.Item,{label:"菜单路径",name:"path",rules:[{required:!0,message:"请输入菜单路径"}],children:e.jsx(re,{size:"large",style:{borderRadius:"8px"}})}),e.jsxs(I.Item,{label:e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsx("span",{children:"菜单JSON配置"}),e.jsx(m,{size:"small",onClick:l,disabled:!a.trim(),style:{borderRadius:"6px"},children:"格式化JSON"})]}),required:!0,children:[e.jsx("div",{style:{border:"1px solid #d9d9d9",borderRadius:"8px",overflow:"hidden"},children:e.jsx(H,{height:"600px",defaultLanguage:"json",value:a,onChange:J,options:{minimap:{enabled:!1},scrollBeyondLastLine:!1,fontSize:14,wordWrap:"on",automaticLayout:!0},theme:"light"})}),d&&e.jsxs("div",{style:{color:"#ff4d4f",marginTop:"8px",fontSize:"14px"},children:["❌ ",d]}),!a.trim()&&e.jsx("div",{style:{color:"#ff4d4f",marginTop:"8px",fontSize:"14px"},children:"❌ 请输入菜单JSON配置"})]})]})})]})})},{Title:ve}=D,Se=()=>{const[r,s]=h.useState(null),[o,a]=h.useState(!1),i=F(),{id:d}=P();h.useEffect(()=>{d&&u(d)},[d]);const u=async g=>{a(!0);try{const x=await j.getById(g);x?s(x):(p.error("菜单配置不存在"),i("/"))}catch{p.error("加载菜单配置失败"),i("/")}finally{a(!1)}},S=async()=>{if(r)try{await navigator.clipboard.writeText(r.jsonConfig),p.success("JSON配置已复制到剪贴板")}catch{const x=document.createElement("textarea");x.value=r.jsonConfig,document.body.appendChild(x),x.select(),document.execCommand("copy"),document.body.removeChild(x),p.success("JSON配置已复制到剪贴板")}},C=async()=>{if(!r)return;const g={version:r.version,path:r.path,jsonConfig:JSON.parse(r.jsonConfig),createdAt:r.createdAt,updatedAt:r.updatedAt};try{await navigator.clipboard.writeText(JSON.stringify(g,null,2)),p.success("完整配置已复制到剪贴板")}catch{const f=document.createElement("textarea");f.value=JSON.stringify(g,null,2),document.body.appendChild(f),f.select(),document.execCommand("copy"),document.body.removeChild(f),p.success("完整配置已复制到剪贴板")}};return o?e.jsx("div",{style:{padding:"24px",textAlign:"center"},children:"加载中..."}):r?e.jsxs("div",{style:{padding:"24px",maxWidth:"1200px",margin:"0 auto"},children:[e.jsxs("div",{style:{marginBottom:"24px",display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center"},children:[e.jsx(m,{icon:e.jsx(U,{}),onClick:()=>i("/"),style:{marginRight:"16px"},children:"返回列表"}),e.jsx(ve,{level:2,style:{margin:0},children:"菜单配置详情"})]}),e.jsxs(Y,{children:[e.jsx(m,{icon:e.jsx($,{}),onClick:C,children:"复制全部"}),e.jsx(m,{type:"primary",icon:e.jsx(q,{}),onClick:()=>i(`/edit/${d}`),children:"编辑配置"})]})]}),e.jsx(R,{style:{marginBottom:"24px"},children:e.jsxs(k,{title:"基本信息",bordered:!0,column:2,children:[e.jsx(k.Item,{label:"菜单路径",span:2,children:r.path}),e.jsx(k.Item,{label:"迭代版本号",children:r.version}),e.jsx(k.Item,{label:"配置ID",children:r.id}),e.jsx(k.Item,{label:"创建时间",children:new Date(r.createdAt).toLocaleString()}),e.jsx(k.Item,{label:"更新时间",children:new Date(r.updatedAt).toLocaleString()})]})}),e.jsx(R,{title:e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e.jsx("span",{children:"JSON配置"}),e.jsx(m,{size:"small",icon:e.jsx($,{}),onClick:S,children:"复制JSON"})]}),children:e.jsx("div",{style:{border:"1px solid #d9d9d9",borderRadius:"6px"},children:e.jsx(H,{height:"500px",defaultLanguage:"json",value:r.jsonConfig,options:{readOnly:!0,minimap:{enabled:!1},scrollBeyondLastLine:!1,fontSize:14,wordWrap:"on",automaticLayout:!0},theme:"light"})})})]}):e.jsx("div",{style:{padding:"24px",textAlign:"center"},children:"菜单配置不存在"})},Ce=()=>e.jsx(ne,{locale:ae,children:e.jsx(oe,{basename:"/menu-home",children:e.jsx("div",{className:"app",children:e.jsxs(ie,{children:[e.jsx(A,{path:"/",element:e.jsx(ye,{})}),e.jsx(A,{path:"/add",element:e.jsx(W,{})}),e.jsx(A,{path:"/edit/:id",element:e.jsx(W,{})}),e.jsx(A,{path:"/detail/:id",element:e.jsx(Se,{})})]})})})});G.createRoot(document.getElementById("root")).render(e.jsx(_.StrictMode,{children:e.jsx(Ce,{})}));
