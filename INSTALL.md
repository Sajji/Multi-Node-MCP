# Installation Guide

## Prerequisites

- **Node.js** 18 or higher (`node --version` to check)
- Access to one or more Collibra instances
- Valid Collibra credentials (username + password)

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Collibra Instances

```bash
cp config.example.json config.json
```

Edit `config.json` with your Collibra instance details:

```json
{
  "instances": [
    {
      "name": "Production",
      "baseUrl": "https://your-instance.collibra.com",
      "username": "your-username",
      "password": "your-password"
    }
  ]
}
```

- **name** — friendly name you'll use in tool calls
- **baseUrl** — your Collibra URL (no trailing slash)
- **username / password** — Collibra credentials

You can add multiple instances to the `instances` array.

### 3. Build

```bash
npm run build
```

### 4. Verify

```bash
npm start
```

You should see:

```
✓ Loaded configuration with 1 Collibra instance(s):
  - Production: https://your-instance.collibra.com
Collibra MCP Server running on stdio
```

Press `Ctrl+C` to stop.

## Connecting to an MCP Client

### Claude Desktop

See [docs/CLAUDE_DESKTOP_SETUP.md](docs/CLAUDE_DESKTOP_SETUP.md) for the full walkthrough.

**Quick version** — edit your Claude Desktop config file:

- **macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`
- **Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

Add the following (replace paths with your actual paths):

```json
{
  "mcpServers": {
    "collibra": {
      "command": "node",
      "args": ["/absolute/path/to/dist/index.js"],
      "env": {
        "COLLIBRA_CONFIG_PATH": "/absolute/path/to/config.json"
      }
    }
  }
}
```

Restart Claude Desktop. You should see all 13 Collibra tools available.

### VS Code (GitHub Copilot)

In your VS Code MCP settings, add the server with the same `command`, `args`, and `env` as above.

### Other MCP Clients

Any client that supports the MCP stdio transport can use this server. Point it at `node dist/index.js` and set the `COLLIBRA_CONFIG_PATH` environment variable.

## Troubleshooting

| Problem | Solution |
|---------|----------|
| "Configuration file not found" | Make sure `config.json` exists, or set `COLLIBRA_CONFIG_PATH` |
| "401 Unauthorized" | Check credentials in `config.json`; verify they work in the Collibra web UI |
| "Instance not found" | `instance_name` in tool calls must exactly match a `name` in `config.json` (case-sensitive) |
| "Cannot find module" | Run `npm run build` — the `dist/` folder must exist |
| MCP server not appearing | Check JSON syntax, use absolute paths, ensure Node.js is on your PATH |

**Replace the paths with your actual paths from Step 6!**

### Restart Claude Desktop

**Completely quit** Claude Desktop (not just close the window):
- **macOS:** Right-click the Dock icon → Quit
- **Windows:** Right-click system tray icon → Exit

Then reopen Claude Desktop.

## Step 7: Verify It Works

In Claude Desktop, try asking:

```
"List all communities from my Production Collibra instance"
```

Claude should use the `get_communities` tool and return your communities!

You should see 8 tools available:
1. get_asset_types
2. query_assets
3. search_assets_by_name
4. get_asset_by_id
5. get_asset_relations
6. get_domains
7. get_communities
8. get_asset_responsibilities

## 🎉 Installation Complete!

## What's Next?

### Learn the Tools
Read `docs/NEW_TOOLS_GUIDE.md` for detailed examples of each tool.

### Try Example Queries

**Search for assets:**
```
"Find assets with 'customer' in the name"
```

**Get complete details:**
```
"Show me everything about asset ID abc-123"
```

**Explore structure:**
```
"What communities and domains exist?"
```

**Check governance:**
```
"Who is responsible for asset abc-123?"
```

### Read the Docs

All documentation is in the `docs/` folder:
- **CLAUDE_DESKTOP_SETUP.md** - Complete setup guide
- **NEW_TOOLS_GUIDE.md** - Tool examples and patterns
- **INHERITED_RESPONSIBILITIES_GUIDE.md** - How inheritance works
- **USER_NAME_RESOLUTION_GUIDE.md** - Technical details
- **RECOMMENDED_TOOLS.md** - Ideas for future tools

## Troubleshooting

### "Configuration file not found"
- Make sure `config.json` exists
- Check the path in your Claude Desktop config
- Use absolute paths (not relative)

### "401 Unauthorized"
- Verify credentials in `config.json`
- Test by logging into Collibra web interface
- Check baseUrl is correct (no trailing slash)

### "Cannot find module"
- Run `npm run build` again
- Check that `dist/` directory exists
- Make sure you're in the project directory

### Tools not showing in Claude Desktop
- Check JSON syntax (use jsonlint.com)
- Verify absolute paths are correct
- Completely quit and restart Claude Desktop
- Check Claude Desktop logs

### More Help
See `docs/CLAUDE_DESKTOP_SETUP.md` for comprehensive troubleshooting.

## Security Notes

- **Never commit** config.json to git (it's already in .gitignore)
- Use service accounts when possible
- Rotate credentials regularly
- Store config.json securely
- Use HTTPS for all Collibra URLs

## Support

For detailed documentation, see:
- README.md - Overview and features
- QUICKSTART.md - Quick reference
- docs/ folder - Comprehensive guides
- CHANGES.md - What's new

Happy data governance! 🚀
