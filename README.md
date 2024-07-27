# Sticker notes

##### **Tech used:** 
1. React + TypeScript
2. Bun.js
3. Appwrite
4. Nginx
5. AWS EC2

##### Deployment steps: 

Follow this [Blog](https://quicktuts.online/blog/deploying-bun-app-ec2-nginx) | [Video](https://www.youtube.com/watch?v=7rlLkgMsExc)

**Nginx part:**

- Add this code to: `/etc/nginx/sites-available/default`

```default

server {
    listen 80;
    server_name _;

    location / {
        proxy_pass  http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

