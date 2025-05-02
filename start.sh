#pkill -f dpd-ui
#ps -ef | grep dpd-ui | grep -v grep 

.venv/bin/uvicorn exporter.webapp.main:app --host 0.0.0.0 --port 8880 
#--reload --reload-dir exporter/webapp 
#tail -f nohup.out
