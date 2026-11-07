
const request = require('supertest');
const { createApp } = require('../src/app');

describe('API de tareas', () => {
  let app;

  beforeEach(() => {
    app = createApp();
  });

  test('GET /health responde ok', async () => {
    const r = await request(app).get('/health');
    expect(r.status).toBe(200);
    expect(r.body.estado).toBe('ok');
  });

  test('POST /api/tareas crea una tarea', async () => {
    const r = await request(app)
      .post('/api/tareas')
      .send({ titulo: 'Configurar pipeline' });

    expect(r.status).toBe(201);
    expect(r.body).toMatchObject({
      id: 1,
      titulo: 'Configurar pipeline',
      completada: false
    });
  });

  test('POST /api/tareas sin título devuelve 400', async () => {
    const r = await request(app)
      .post('/api/tareas')
      .send({});

    expect(r.status).toBe(400);
  });

  test('PATCH /api/tareas/:id alterna completada', async () => {
    await request(app)
      .post('/api/tareas')
      .send({ titulo: 'Escribir pruebas' });

    const r = await request(app).patch('/api/tareas/1');

    expect(r.body.completada).toBe(true);
  });

  test('PATCH de una tarea inexistente devuelve 404', async () => {
    const r = await request(app).patch('/api/tareas/99');
    expect(r.status).toBe(404);
  });

  test('GET /metrics cuenta solicitudes y tareas', async () => {
    await request(app)
      .post('/api/tareas')
      .send({ titulo: 'Medir' });

    const r = await request(app).get('/metrics');

    expect(r.body.tareas).toBe(1);
    expect(r.body.solicitudes).toBeGreaterThanOrEqual(2);
  });

  // NUEVA PRUEBA 1: eliminar una tarea correctamente.
  test('DELETE /api/tareas/:id elimina una tarea', async () => {
    await request(app)
      .post('/api/tareas')
      .send({ titulo: 'Tarea para eliminar' });

    const r = await request(app).delete('/api/tareas/1');

    expect(r.status).toBe(200);
    expect(r.body.mensaje).toBe('Tarea eliminada correctamente');

    const lista = await request(app).get('/api/tareas');
    expect(lista.body).toHaveLength(0);
  });

  // NUEVA PRUEBA 2: intentar eliminar una tarea inexistente.
  test('DELETE de una tarea inexistente devuelve 404', async () => {
    const r = await request(app).delete('/api/tareas/99');

    expect(r.status).toBe(404);
    expect(r.body.error).toBe('Tarea no encontrada');
  });
});
