-- InsertData
INSERT INTO "Categoria" ("id", "nome", "tipo", "created_at", "updated_at") VALUES
    (gen_random_uuid(), 'Lanche', 'LANCHE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (gen_random_uuid(), 'Acompanhamento', 'ACOMPANHAMENTO', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (gen_random_uuid(), 'Bebida', 'BEBIDA', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    (gen_random_uuid(), 'Sobremesa', 'SOBREMESA', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
