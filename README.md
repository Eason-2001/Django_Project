```
在线对战小游戏项目
📖 项目简介
本项目是一款基于 Django + jQuery 开发的多人在线对战小游戏，采用现代化前端交互与后端服务架构，实现了完整的用户认证、英雄选择、游戏对战流程。
界面采用暗黑毛玻璃风格，视觉统一且富有科技感；核心模块高度解耦，便于后续扩展新英雄、新玩法与新功能。
✨ 核心功能

🛠️ 技术栈
表格
层级	技术	说明
后端	Django 4.x / Python 3.10+	Web 服务、用户管理、静态资源托管
前端	HTML5 + CSS3 + jQuery	页面结构、样式与交互逻辑
架构	模块化 OOP 设计	代码解耦，便于维护与扩展
静态资源	Django StaticFiles	图片、CSS、JS 统一管理

🚀 快速开始
1. 环境准备
bash
运行
# 克隆项目
https://github.com/Eason-2001/Django_Project.git
cd your_django_project

# 安装依赖
pip install -r requirements.txt

# 数据库迁移
python manage.py makemigrations
python manage.py migrate

# 创建超级管理员
python manage.py createsuperuser

2. 启动服务
共有三个服务需要启动
1.acapp 中的 uwsgi --ini scripts/uwsgi.ini   
2.acapp 中的daphne -b 0.0.0.0 -p 5015 acapp.asgi:application\
3./acapp/match_system/src 中的 ./main.py
附：js打包脚本：/home/lfs/acapp/scripts/compress_game_js.sh   


🎨 界面风格规范

主色调：深灰背景 + 红色渐变按钮（#ff4757）
视觉效果：毛玻璃（backdrop-filter: blur(10px)）、阴影、圆角
交互反馈：hover 放大 / 变色、点击下沉效果
响应式：使用 vw/vh 单位，适配不同屏幕尺寸
📌 扩展方向
英雄扩展
新增英雄模型、技能与专属音效
实现英雄平衡性调整
玩法扩展
增加排位赛、匹配机制
开发道具系统、天赋系统
体验优化
加入英雄切换动画、技能释放特效
实现聊天系统、好友系统
技术升级
引入 WebSocket 实现实时多人对战
迁移至 React/Vue 现代化前端框架
开发中敬请期待 ......
```