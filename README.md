# AI API Proxy

## Description

This is an API proxy server for calling popular AI APIs from the frontend without exposing API keys. I will use this server in my own project to call APIs from a Unity WebGL application. 

### Built with

- NodeJS
- Express

## Getting started

### Prerequisites

Ensure Node is installed.

### Install

Clone project and run npm i

### Enviroment Variables

PORT = '3030'
ALLOWED_ORIGINS="http://localhost:3030 http://localhost:5173"  
DB_CONNECTION= Mongo Connection string  

#API URLs
UNREALSPEECH_URL = "https://api.v7.unrealspeech.com"  
ELEVENLABS_URL = "https://api.elevenlabs.io/v1/text-to-speech"  
OPENAI_URL = "https://api.openai.com/v1/"  
DEEPSEEK_URL="https://api.deepseek.com"  


HF_WHISPER_TURBO_URL = "https://api-inference.huggingface.co/models/openai/whisper-large-v3-turbo"  
HF_WHISPER_URL = "https://api-inference.huggingface.co/models/openai/whisper-large-v3"  


#API Keys
OPENAI_API_KEY = "sk-YOUR API KEY"  
E11LABS_API_KEY = "sk-YOUR API KEY"  
UNREAL_API_KEY = "YOUR API KEY"  
HUGGINGFACE_API_KEY = "hf_YOUR API KEY"  
ANTHROPIC_API_KEY = "sk-YOUR API KEY"  
DEEPSEEK_API_KEY="sk-YOUR API KEY"  
