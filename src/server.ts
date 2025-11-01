import { Model, createServer, Response, Request, hasMany, belongsTo } from 'miragejs';
import { DragDropLocation } from './app/board/models';
import type Schema from 'miragejs/orm/schema';

let server;
let userSessions: Record<string, { expires: number; isAdmin: boolean }> = {};

const HARDCODED_TOKENS = {
  admin: 'admin-fake-token',
  user: 'user-fake-token',
};

function getColumnsAndTickets(schema: Schema<any>) {
  const columns = schema.db['columns'];
  const tickets = schema.db['tickets'];

  return { columns, tickets };
}

function shiftTickets(schema: Schema<any>, whereFn: (t: any) => any, isShift: boolean = true) {
  (schema as any)['tickets'].where(whereFn).models.forEach((ticket: any) => {
    schema.db['tickets'].update(ticket.id, {
      order: ticket.order + (isShift ? 1 : -1),
    });
  });
}

function checkAuthToken(request: Request) {
  // Todo: Remove on chapter 8
  return {};

  const auth = request.requestHeaders['Authorization'];
  if (!auth) {
    return null;
  }

  const token = auth.split(' ')[1] || '';
  return userSessions[token] || null;
}

export default function initServer() {
  server = createServer({
    models: {
      column: Model.extend({
        tickets: hasMany(),
      }),
      ticket: Model.extend({
        column: belongsTo(),
      }),
    },

    seeds(server) {
      server.db.loadData({
  columns: [
    { id: "col-1", title: "Backlog", order: 1 },
    { id: "col-2", title: "À faire", order: 2 },
    { id: "col-3", title: "En cours", order: 3 },
    { id: "col-4", title: "Revue", order: 4 },
    { id: "col-5", title: "Terminé", order: 5 },
  ],
  tickets: [
    {
      id: "ticket-1",
      title: "Créer le modèle de données utilisateur",
      description: "Définir les champs nécessaires pour le profil utilisateur.",
      type: "task",
      assignee: "dev1",
      order: 1,
      columnId: "col-1",
    },
    {
      id: "ticket-2",
      title: "Corriger l'erreur 404 sur la page produit",
      description: "La page produit renvoie une erreur 404 pour certains IDs.",
      type: "bug",
      assignee: "dev2",
      order: 1,
      columnId: "col-2",
    },
    {
      id: "ticket-3",
      title: "Ajouter un filtre par catégorie",
      description: "Permettre aux utilisateurs de filtrer les produits par catégorie.",
      type: "feature",
      assignee: "dev3",
      order: 1,
      columnId: "col-3",
    },
    {
      id: "ticket-4",
      title: "Mettre à jour la documentation API",
      description: "Ajouter les nouveaux endpoints et exemples d'utilisation.",
      type: "task",
      assignee: "dev1",
      order: 2,
      columnId: "col-3",
    },
    {
      id: "ticket-5",
      title: "Tester la compatibilité mobile",
      description: "Vérifier l'affichage et l'interaction sur mobile.",
      type: "task",
      assignee: "dev4",
      order: 1,
      columnId: "col-4",
    },
    {
      id: "ticket-6",
      title: "Optimiser les images pour le web",
      description: "Compresser et redimensionner les images pour un chargement plus rapide.",
      type: "task",
      assignee: "dev2",
      order: 2,
      columnId: "col-2",
    },
    {
      id: "ticket-7",
      title: "Ajouter un système de commentaires",
      description: "Permettre aux utilisateurs de commenter les produits.",
      type: "feature",
      assignee: "dev3",
      order: 2,
      columnId: "col-1",
    },
    {
      id: "ticket-8",
      title: "Corriger le bug de panier vide",
      description: "Le panier reste vide après ajout d'un produit.",
      type: "bug",
      assignee: "dev1",
      order: 3,
      columnId: "col-3",
    },
    {
      id: "ticket-9",
      title: "Déployer la nouvelle version",
      description: "Déployer la version 1.2.0 sur le serveur de production.",
      type: "task",
      assignee: "dev4",
      order: 1,
      columnId: "col-5",
    },
    {
      id: "ticket-10",
      title: "Mettre à jour les dépendances",
      description: "Mettre à jour toutes les dépendances npm pour éviter les vulnérabilités.",
      type: "task",
      assignee: "dev2",
      order: 2,
      columnId: "col-5",
    },
  ],
});
    },

    routes() {
      this.namespace = '/api';

      this.get('/board', (schema, request) => {
        const user = checkAuthToken(request);
        if (user === null) {
          return new Response(401, {}, { error: 'Unauthorized' });
        }

        const board = getColumnsAndTickets(schema);
        return new Response(200, {}, { board });
      });

      this.patch('/board/ticket/reorder/:ticketId', (schema, request) => {
        const user = checkAuthToken(request);
        if (user === null) {
          return new Response(401, {}, { error: 'Unauthorized' });
        }

        const ticketId = request.params['ticketId'];

        const { to } = JSON.parse(request.requestBody) as {
          to: DragDropLocation;
        };

        if (ticketId === to.ticketId) return new Response(400, {}, { error: 'Initial place' });

        const fromTicket = schema.db['tickets'].find(ticketId);

        if (!to.ticketId) {
          schema.db['tickets'].update(ticketId, {
            columnId: to.columnId,
            order: 1,
          });

          shiftTickets(
            schema,
            (t: any) => t.columnId === fromTicket.columnId && t.order >= fromTicket.order,
            false,
          );
        } else {
          const toTicket = schema.db['tickets'].find(to.ticketId);

          const areSameColumn = fromTicket.columnId === toTicket.columnId;
          const isDesc = toTicket.order > fromTicket.order;

          if (!areSameColumn) {
            shiftTickets(
              schema,
              (t: any) => t.columnId === fromTicket.columnId && t.order >= fromTicket.order,
              false,
            );
            shiftTickets(
              schema,
              (t: any) => t.columnId === toTicket.columnId && t.order >= toTicket.order,
            );
          } else {
            const predicate = isDesc
              ? (t: any) =>
                  t.columnId === toTicket.columnId &&
                  t.order <= toTicket.order &&
                  t.order >= fromTicket.order
              : (t: any) =>
                  t.columnId === toTicket.columnId &&
                  t.order >= toTicket.order &&
                  t.order <= fromTicket.order;

            shiftTickets(schema, predicate, !isDesc);
          }

          schema.db['tickets'].update(fromTicket.id, {
            columnId: to.columnId,
            order: toTicket.order,
          });
        }

        const board = getColumnsAndTickets(schema);
        return new Response(200, {}, { board });
      });

      this.post('/board/ticket/:columnId', (schema, request) => {
        const user = checkAuthToken(request);
        if (user === null) {
          return new Response(401, {}, { error: 'Unauthorized' });
        }

        const columnId = request.params['columnId'];
        const body = JSON.parse(request.requestBody);

        const createdTicket = schema.db['tickets'].insert({
          order: schema.db['tickets'].where({ columnId }).length + 1,
          columnId,
          ...body.ticket,
        });

        return new Response(200, {}, { createdTicket });
      });

      this.post(
        '/login',
        (schema, request) => {
          // return new Response(400, {}, 'Identifiants incorrects');
          const body = JSON.parse(request.requestBody);
          const expiry = Date.now() + 1000 * 60 * 60;

          if (body.email === 'admin@test.com' && body.password === '1234') {
            userSessions[HARDCODED_TOKENS.admin] = {
              expires: expiry,
              isAdmin: true,
            };

            return new Response(
              200,
              {},
              {
                user: { username: 'Marc', isAdmin: true },
                authToken: HARDCODED_TOKENS.admin,
              },
            );
          } else if (body.email === 'user@test.com' && body.password === '1234') {
            userSessions[HARDCODED_TOKENS.user] = {
              expires: expiry,
              isAdmin: false,
            };

            return new Response(
              200,
              {},
              {
                user: { username: 'John', isAdmin: false },
                authToken: HARDCODED_TOKENS.user,
              },
            );
          }

          return new Response(401, {}, { error: 'Unauthorized' });
        },
        { timing: 1000 },
      );

      this.post('/logout', (schema, request) => {
        const auth = request.requestHeaders['Authorization'];
        delete userSessions[auth];
        return new Response(200);
      });
    },
  });

  return server;
}