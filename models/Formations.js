const mongoose = require('mongoose');
/**
 * nomForm: Nom de la formation
 * dateForm: Date de la Formation
 * nbrUtilMax: Nombre d'utilisation maximum
 * themForm: Thématique de la formation
 * prix: Prix
 * dateAjout: Date d'ajout de la formation
 * dateModif: Date de modification de la formation
 */
const FormationSchema = mongoose.Schema({
  nomForm: { type: String, required: true },
  dateForm: { type: Date, required: true },
  nbrUtilMax: { type: Number, required: true },
  themForm: { type: String, required: true },
  prix: { type: Number, required: true },
  dateAjout: {type: Date, required: true},
  dateModif: {type: Date, required: true},
});

module.exports = mongoose.model('Thing', FormationSchema);