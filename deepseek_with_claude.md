# Using Deepseek with claude api

[pencil.dev in vscode needs a claude code subscription what are my alternatives? how can i use deepseek api key with it?](https://www.google.com/search?q=pencil.dev+in+vscode+needs+a+claude+code+subscription+what+are+my+alternatives%3F+how+can+i+use+deepseek+api+key+with+it%3F&rlz=1C1VDKB_enUS1190US1190&oq=pencil.dev+in+vscode+needs+a+claude+code+subscription+what+are+my+alternatives%3F++how+can+i+use+deepseek+api+key+with+it%3F&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIHCAEQIRiPAjIHCAIQIRiPAtIBCTM0MzYxajBqN6gCALACAA&sourceid=chrome&ie=UTF-8)

Pencil.dev’s built-in AI features require Claude Code to function, which previously relied on a paid subscription. However, you do not need to pay for a Claude subscription; you can easily configure Claude Code to use your DeepSeek API key (and pay only for the exact tokens you use). Alternatively, you can use other agentic tools like Cline or Aider. [1, 2, 3, 4, 5, 6]  
How to use your DeepSeek API key with Claude Code 
DeepSeek natively provides compatibility for Claude Code through its Anthropic API wrapper. This allows you to use Pencil.dev without Anthropic billing. [2, 7]  
1. Get your API Key: 

• Go to the  DeepSeek Platform  and create an account. 
• Navigate to the API Keys section and generate a new key. [8, 9]  

2. Configure your Environment Variables:Set the following environment variables in your terminal (where you normally run Claude Code or Pencil): 

• Mac / Linux: 
```bash
export ANTHROPIC_BASE_URL=https://api.deepseek.com/anthropic
export ANTHROPIC_AUTH_TOKEN=your_deepseek_api_key_here
export ANTHROPIC_MODEL=deepseek-v4-pro[1m]
export ANTHROPIC_DEFAULT_OPUS_MODEL=deepseek-v4-pro[1m]
export ANTHROPIC_DEFAULT_SONNET_MODEL=deepseek-v4-pro[1m]
export ANTHROPIC_DEFAULT_HAIKU_MODEL=deepseek-v4-flash
export CLAUDE_CODE_SUBAGENT_MODEL=deepseek-v4-flash
export CLAUDE_CODE_EFFORT_LEVEL=max
```

• Windows (PowerShell): 
```powershell
$env:ANTHROPIC_BASE_URL="https://api.deepseek.com/anthropic"
$env:ANTHROPIC_AUTH_TOKEN="your_deepseek_api_key_here"
$env:ANTHROPIC_MODEL="deepseek-v4-pro"
```

Once set, any  command you run in that terminal session will securely route to DeepSeek's endpoints while still pretending to communicate with Anthropic. [1]  
Best Alternatives to Claude Code for VS Code 
If you are looking to move completely away from Claude Code, VS Code offers powerful, free AI coding agents: 

• Cline: A highly popular, open-source VS Code extension that operates as an autonomous coding agent. It allows you to select custom API providers, meaning you can easily plug in DeepSeek, OpenAI, Gemini, or Ollama (for local models) without a subscription. 
• Aider: A powerful command-line AI pair programmer that supports almost any model, including DeepSeek Coder. 
• Continue: A widely used VS Code extension for chat-based and agentic AI. It natively supports DeepSeek and local models like DeepSeek-R1 or DeepSeek Coder. [16, 17, 18, 19, 20]  

If you're interested, I can: 

• Provide a step-by-step guide on connecting your DeepSeek key to Cline or Continue. 
• Help you set up local models (like Llama or Qwen) if you want completely free, offline coding assistance. [16, 21, 22]  

Let me know how you'd like to proceed with your setup! 

AI responses may include mistakes.

[1] https://www.youtube.com/watch?v=VNiRlWx5roo
[2] https://api-docs.deepseek.com/quick_start/agent_integrations/claude_code
[3] https://www.digitalocean.com/resources/articles/claude-code-alternatives
[4] https://www.reddit.com/r/LocalLLaMA/comments/1kzf9nl/deepseek_is_cool_but_is_there_an_alternative_to/
[5] https://uxpilot.ai/pencil-dev
[6] https://marketplace.visualstudio.com/items?itemName=anthropic.claude-code
[7] https://www.youtube.com/watch?v=An5ILpmd7iU
[8] https://www.skillboss.co/docs/blog/claude-code-alternatives
[9] https://www.youtube.com/watch?v=2dhqgXajnV0
[10] https://kilo.ai/compare/claude-code-alternatives
[11] https://creator.poe.com/docs/external-applications/interface-configuration
[12] https://medium.com/data-science-collective/cursor-vs-claude-code-87240ad9265e
[13] https://www.morphllm.com/comparisons/claude-code-alternatives
[14] https://www.linkedin.com/pulse/open-source-ai-coding-agents-comprehensive-guide-self-hosted-shaw-pqfxe
[15] https://prismic.io/blog/claude-code
[16] https://www.youtube.com/watch?v=dYvZ0Bi54T4
[17] https://www.youtube.com/watch?v=oqCj4_-VMxw
[18] https://www.sitepoint.com/deepseek-r1-vs-claude-code-the-complete-showdown-2026/
[19] https://github.com/theoheneba/deepseek
[20] https://www.digitalocean.com/resources/articles/deepseek-alternatives
[21] https://www.youtube.com/watch?v=kUlkSqz32Pw
[22] https://www.youtube.com/watch?v=9aGQGzZW_hY

