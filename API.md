# Cslivem API Design

> For future ECS cloud sync integration. All endpoints follow OpenAI-compatible REST conventions.

## Authentication

All requests require Bearer token:
```
Authorization: Bearer <api_key>
```

## Endpoints

### Notes

| Method | Path | Description |
|--------|------|-------------|
| GET | /v1/notes | List notes (paginated) |
| POST | /v1/notes | Create note |
| GET | /v1/notes/:id | Get note by ID |
| PATCH | /v1/notes/:id | Update note |
| DELETE | /v1/notes/:id | Delete note |

### Knowledge Graph

| Method | Path | Description |
|--------|------|-------------|
| GET | /v1/graph | Get graph (filterable) |
| POST | /v1/graph/nodes | Create node |
| POST | /v1/graph/edges | Create edge |
| GET | /v1/graph/search | Search nodes |

### AI

| Method | Path | Description |
|--------|------|-------------|
| POST | /v1/ai/chat | Chat completion (OpenAI-compatible) |
| POST | /v1/ai/summarize | Summarize text |
| POST | /v1/ai/vision | Image analysis |
| POST | /v1/ai/ocr | OCR text extraction |

### Sync

| Method | Path | Description |
|--------|------|-------------|
| POST | /v1/sync/upload | Upload local snapshot |
| GET | /v1/sync/download | Download remote changes |
| GET | /v1/sync/status | Get sync status |

### Calendar

| Method | Path | Description |
|--------|------|-------------|
| GET | /v1/calendar/items | List events |
| POST | /v1/calendar/items | Create event |
| PATCH | /v1/calendar/items/:id | Update event |

## Data Formats

### Note
```json
{
  "id": "string",
  "title": "string",
  "content": "string (markdown)",
  "tags": ["string"],
  "category": "string",
  "createdAt": "ISO8601",
  "updatedAt": "ISO8601"
}
```

### Graph Node
```json
{
  "id": "string",
  "type": "note|tag|concept|entity",
  "label": "string",
  "metadata": {}
}
```

### Sync Snapshot
```json
{
  "version": 2,
  "exportedAt": "ISO8601",
  "graph": { "nodes": {}, "edges": {} },
  "notes": [],
  "calendar": { "events": [], "diary": [] },
  "ledger": { "accounts": [], "transactions": [] }
}
```

## Rate Limits (Planned)

- AI endpoints: 30 req/min
- Sync endpoints: 10 req/min
- CRUD endpoints: 120 req/min