WITH campus (id, name, slug, address, city, phone, whatsapp, email, landmark, "mapEmbedUrl") AS (
VALUES (
  'branch-thoraipakkam',
  'Thoraipakkam',
  'thoraipakkam',
  'First floor, Neela Arcade, No. 7, 200 Feet Radial Rd, Thoraipakkam, Chennai, Tamil Nadu 600097',
  'Chennai',
  '+919443594435',
  '+919003790017',
  'Seeyam.tech@gmail.com',
  'Neela Arcade',
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3888.3359887124116!2d80.23156061077928!3d12.950339287310534!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525d005e653d01%3A0xfd6851cad8cabab8!2sSeeyam!5e0!3m2!1sen!2sin!4v1795599077413!5m2!1sen!2sin'
)), updated AS (
  UPDATE branches AS existing
  SET name = campus.name, slug = campus.slug, address = campus.address,
      city = campus.city, phone = campus.phone, whatsapp = campus.whatsapp,
      email = campus.email, landmark = campus.landmark, "mapEmbedUrl" = campus."mapEmbedUrl"
  FROM campus
  WHERE existing.slug = campus.slug OR existing.name = campus.name
  RETURNING existing.id
)
INSERT INTO branches (id, name, slug, address, city, phone, whatsapp, email, landmark, "mapEmbedUrl")
SELECT id, name, slug, address, city, phone, whatsapp, email, landmark, "mapEmbedUrl"
FROM campus
WHERE NOT EXISTS (SELECT 1 FROM updated);
