import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Alston's Blog",
  description: "",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
    ],

    sidebar: [
      {
        text: 'Backend',
        items: [
          {text:'2020如何選擇Web後端框架？', link: '/2020如何選擇Web後端框架？.md'},
          {text:'NodeJS+ES7+Express+MySQL打造API server最佳起手式', link: '/NodeJS+ES7+Express+MySQL打造API server最佳起手式.md'},
          {text:'MySQL JSON type Export & Import', link: '/MySQL JSON type Export & Import.md'},
          {text:'MySQL 調教', link: '/MySQL 調教.md'},
          {text:'Nginx 調教', link: '/Nginx 調教.md'},
          {text:'LNMP docker', link: '/LNMP docker.md'},
          
        ]
      },
      {
        text: 'Frontend',
        items: [
          {text:'小米的兩道面試題', link: '/小米的兩道面試題.md'},
          {text:'前端新手如何用Vuejs一週打造電商後台(1)', link: '/前端新手如何用Vuejs一週打造電商後台(1).md'},
          {text:'瀏覽器圖片直傳AWS S3', link: '/瀏覽器圖片直傳AWS S3.md'},
          {text:'Fill PDF form and stamp programmatically', link: '/Fill PDF form and stamp programmatically.md'},
          {text:'ES7 async & await不足之處', link: '/ES7 async & await不足之處.md'},
          
        ]
      },
      
      {
        text: 'AI',
        items: [
          {text:'Object detection', link: '/Object detection.md'},
          {text:'Opencv 3.2.0 with CUDA 8.0 on tensorflow docker', link: '/Opencv 3.2.0 with CUDA 8.0 on tensorflow docker.md'},
          {text:'Opencv 3.2.0 with CUDA 8.0 on Ubuntu 16.04', link: '/Opencv 3.2.0 with CUDA 8.0 on Ubuntu 16.04.md'},
          {text:'OpenCV in Swift 3', link: '/OpenCV in Swift 3.md'},
          {text:'行人檢測', link: '/行人檢測.md'},
          
        ]
      },
      {
        text: 'Mobile',
        items: [
          {text:'移除Xcode暫存build', link: '/移除Xcode暫存build.md'},
          {text:'Swift @noescape與@escaping', link: '/Swift @noescape與@escaping.md'},
          {text:'Swift到底什麼場合會用到閉包？', link: '/Swift到底什麼場合會用到閉包？.md'},

        ]
      },
      
      {
        text: 'RPi',
        items: [
          {text:'CNN on RPi 3', link: '/CNN on RPi 3.md'},
          {text:'Cmake cross compile from OSX to Raspberry pi with OpenCV', link: '/Cmake cross compile from OSX to Raspberry pi with OpenCV.md'},
         
        ]
      },
      
      {
        text: 'System',
        items: [
          {text:'ubuntu ftp', link: '/ubuntu ftp.md'},
          {text:'Ubuntu 滾輪速度', link: '/Ubuntu 滾輪速度.md'},
          {text:'Ubuntu交換Ctrl與Alt鍵', link: '/Ubuntu交換Ctrl與Alt鍵.md'},
          {text:'Ubuntu安裝Nvida Driver與CUDA', link: '/Ubuntu安裝Nvida Driver與CUDA.md'},
          {text:'SSH forwarding & reverse tunnel best explaination', link: '/SSH forwarding & reverse tunnel best explaination.md'},
          {text:'SSH port forwarding', link: '/SSH port forwarding.md'},
          {text:'SSH Reverse Tunnel with autossh', link: '/SSH Reverse Tunnel with autossh.md'},
          {text:'安裝dlib', link: '/安裝dlib.md'},
          {text:'Install go lang using gvm', link: '/Install go lang using gvm.md'},
          {text:'install nginx magento ', link: '/install nginx magento .md'},
          {text:'Mac & Linux POS系統架構', link: '/Mac & Linux POS系統架構.md'},
          
        ]
      },
      {
        text: 'Other',
        items: [
          {text:'AWS Elastic Load Balancer(ELB) SSL Certificate with Nginx', link: '/AWS Elastic Load Balancer(ELB) SSL Certificate with Nginx.md'},
          {text:'cpanel 上使用 NodeJS的坑', link: '/cpanel 上使用 NodeJS的坑.md'},
          {text:'g++ pure virtual method called', link: '/g++ pure virtual method called'},
          {text:'google workspace send mail', link: '/google workspace send mail.md'},
        ]
      },
      
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/red010182/blog' }
    ]
  }
})
