# Domains (DDD)

Structure per domain:
- domain/: entities, value-objects, events, repository ports
- application/: use-cases (services), DTOs
- infrastructure/: adapters, repository implementations
- ui/: presentation (routes, screens, widgets, hooks)

Cross-domain communication should depend on application ports, not infrastructure.
