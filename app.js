const express = require('express');
const app = express();
const cors = require("cors")
const mongoose = require('mongoose');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const Formations = require('./models/Formations');

// Configuration des options Swagger
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0', // Version d'OpenAPI
    info: {
      title: "My API",
      version: "1.0.0",
      description: "API documentation avec Swagger"
    },
    servers: [
      { url: "https://gstformationbak-2-qwl2.onrender.com" } // Base URL de l'API
    ],
    components: {
      schemas: {
        Formation: {
          type: "object",
          properties: {
            nomForm: {
              type: "string",
              description: "Nom de la formation"
            }
          }
        }
      }
    },
  },
  apis: ["app.js"], // Fichiers contenant des annotations Swagger
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Route Swagger
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

mongoose.connect('mongodb+srv://Ambdou:Ambdou321@cluster0.laxil.mongodb.net/?retryWrites=true&w=majority&appName=GestionFormation')
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json());
app.use(cors())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

/**
 * @swagger
 * /api/formation:
 *   post:
 *     summary: Ajouter une nouvelle formation
 *     description: Endpoint pour enregistrer une nouvelle formation dans la base de données.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nomForm:
 *                 type: string
 *                 description: Nom de la formation
 *                 example: "Formation en développement web"
 *               dateForm:
 *                 type: string
 *                 format: date
 *                 description: Date de la formation
 *                 example: "2024-01-15"
 *               nbrUtilMax:
 *                 type: integer
 *                 description: Nombre maximal de participants
 *                 example: 25
 *               themForm:
 *                 type: string
 *                 description: Thème de la formation
 *                 example: "Programmation JavaScript"
 *               prix:
 *                 type: number
 *                 format: float
 *                 description: Prix de la formation
 *                 example: 150.50
 *               dateAjout:
 *                 type: string
 *                 format: date
 *                 description: Date d'ajout de la formation
 *                 example: "2024-01-01"
 *               dateModif:
 *                 type: string
 *                 format: date
 *                 description: Date de dernière modification
 *                 example: "2024-01-10"
 *             required:
 *               - nomForm
 *               - dateForm
 *               - nbrUtilMax
 *               - themForm
 *               - prix
 *               - dateAjout
 *               - dateModif
 *     responses:
 *       201:
 *         description: Formation ajoutée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Formation enregistrée avec succès !"
 *       400:
 *         description: Erreur lors de l'enregistrement de la formation.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur lors de l'enregistrement."
 */
app.post('/api/formation', (req, res, next) => {
  delete req.body._id;
  const formation = new Formations({
    ...req.body
  })
  formation.save()
    .then(() => res.status(201).json({ message: 'Objet enregistrer !' }))
    .catch(error => res.status(400).json({ error }));
})


app.get('/api/formation/:id', (req, res) => {
  Formations.findOne({ _id: req.params.id })
    .then(thing => res.status(201).json(thing))
    .catch(error => res.status(404).json({ error }))
});

/**
 * @swagger
 * /api/formation/{id}:
 *   get:
 *     summary: Récupérer une formation par ID
 *     description: Endpoint pour récupérer les détails d'une formation spécifique à l'aide de son ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identifiant unique de la formation.
 *         schema:
 *           type: string
 *           example: "64bfc9e7d3a4c92f884f3c1e"
 *     responses:
 *       200:
 *         description: Détails de la formation récupérés avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 nomForm:
 *                   type: string
 *                   description: Nom de la formation
 *                   example: "Formation en développement web"
 *                 dateForm:
 *                   type: string
 *                   format: date
 *                   description: Date de la formation
 *                   example: "2024-01-15"
 *                 nbrUtilMax:
 *                   type: integer
 *                   description: Nombre maximal de participants
 *                   example: 25
 *                 themForm:
 *                   type: string
 *                   description: Thème de la formation
 *                   example: "Programmation JavaScript"
 *                 prix:
 *                   type: number
 *                   format: float
 *                   description: Prix de la formation
 *                   example: 150.50
 *                 dateAjout:
 *                   type: string
 *                   format: date
 *                   description: Date d'ajout de la formation
 *                   example: "2024-01-01"
 *                 dateModif:
 *                   type: string
 *                   format: date
 *                   description: Date de dernière modification
 *                   example: "2024-01-10"
 *       404:
 *         description: Formation non trouvée.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Formation introuvable."
 */
app.put('/api/formation/:id', (req, res, next) => {
  Formations.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet modifié !' }))
    .catch(error => res.status(400).json({ error }));
});

/**
 * @swagger
 * /api/formation/{id}:
 *   delete:
 *     summary: Supprimer une formation par ID
 *     description: Endpoint pour supprimer une formation à l'aide de son ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Identifiant unique de la formation à supprimer.
 *         schema:
 *           type: string
 *           example: "64bfc9e7d3a4c92f884f3c1e"
 *     responses:
 *       200:
 *         description: Formation supprimée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Objet supprimé !"
 *       400:
 *         description: Erreur lors de la suppression de la formation.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur lors de la suppression de la formation."
 */
app.delete('/api/formation/:id', (req, res, next) => {
  Formations.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
    .catch(error => res.status(400).json({ error }));
});

/**
 * @swagger
 * /api/formation:
 *   get:
 *     summary: Récupérer toutes les formations
 *     description: Endpoint pour récupérer la liste de toutes les formations disponibles.
 *     responses:
 *       200:
 *         description: Liste des formations récupérée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   nomForm:
 *                     type: string
 *                     example: "Formation en développement web"
 *                   dateForm:
 *                     type: string
 *                     format: date
 *                     example: "2024-01-15"
 *                   nbrUtilMax:
 *                     type: integer
 *                     example: 30
 *                   themForm:
 *                     type: string
 *                     example: "Développement"
 *                   prix:
 *                     type: number
 *                     example: 1500
 *                   dateAjout:
 *                     type: string
 *                     format: date
 *                     example: "2023-12-01"
 *                   dateModif:
 *                     type: string
 *                     format: date
 *                     example: "2023-12-10"
 *       400:
 *         description: Erreur lors de la récupération des formations.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Erreur lors de la récupération des formations."
 */
app.get('/api/formation', (req, res, next) => {
  Formations.find()
    .then(things => res.status(200).json(things))
    .catch(error => res.status(400).json({ error }));
})

module.exports = app;