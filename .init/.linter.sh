#!/bin/bash
cd /home/kavia/workspace/code-generation/webvital-monitor-53268-53385/FrontendWebApplication
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

