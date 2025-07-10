python -m venv .venv

.venv/bin/pip install uvicorn fastapi jinja2  httpx





#install from scratch other 

apt-get update
apt-get install -y software-properties-common
add-apt-repository ppa:deadsnakes/ppa
apt-get update
apt-get install -y python3.9
python --version

python3.9 -m venv .venv
ll
cat install.sh 
cd /var/www/dpd-ui/
ll
cat install.sh 
.venv/bin/pip install uvicorn fastapi jinja2  httpx
.venv/bin/python3.9 -m pip install --upgrade pip


cat > /etc/nginx/sites-available/dict.dhamma.gift

server {
    listen 80;
    server_name dict.dhamma.gift www.dict.dhamma.gift d2.dhamma.gift www.d2.dhamma.gift;

    location /.well-known/acme-challenge/ {
        root /var/www/html;
        allow all;
    }

    location / {
        proxy_pass http://127.0.0.1:8880;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}



sudo ln -s /etc/nginx/sites-available/dict.dhamma.gift /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
sudo ln -s /etc/nginx/sites-available/dict.dhamma.gift /etc/nginx/sites-enabled/

rm /etc/nginx/sites-enabled/default

sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d dict.dhamma.gift -d www.dict.dhamma.gift -d d2.dhamma.gift -d www.d2.dhamma.gift


