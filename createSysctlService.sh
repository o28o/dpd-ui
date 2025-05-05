#!/bin/bash

# Этот скрипт создает unit-файл для systemd
# Автор: Ваше имя
# Дата: 2024-05-05

UNIT_FILE="/etc/systemd/system/dpd-ui.service"

# Создаем unit-файл с комментариями внутри
cat > "$UNIT_FILE" <<EOF
# /etc/systemd/system/dpd-ui.service
# Этот файл управляет сервисом dpd-ui

[Unit]
Description=DPD UI Service
After=network.target

[Service]
User=www-data
Group=www-data
WorkingDirectory=/var/www/dpd-ui
# PATH включает виртуальное окружение Python
Environment="PATH=/var/www/dpd-ui/.venv/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
ExecStart=/bin/bash -c '/var/www/dpd-ui/.venv/bin/uvicorn exporter.webapp.main:app --host 0.0.0.0 --port 8880'
Restart=always
RestartSec=5

# Логирование в systemd journal
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
EOF

# Команды для применения изменений (это комментарии для скрипта, а не для unit-файла)
echo "Unit-файл создан. Выполните:"
echo "  sudo systemctl daemon-reload"
echo "  sudo systemctl enable dpd-ui --now"
