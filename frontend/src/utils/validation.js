import * as yup from 'yup'

const emailRule = yup
  .string()
  .required("L'email est obligatoire")
  .email('Email invalide')

const passwordRule = yup
  .string()
  .required('Le mot de passe est obligatoire')
  .min(6, 'Le mot de passe doit contenir au moins 6 caractères')

export const loginSchema = yup.object().shape({
  email: emailRule,
  password: yup.string().required('Le mot de passe est obligatoire'),
})

export const forgotPasswordSchema = yup.object().shape({
  email: emailRule,
})

export const resetPasswordSchema = yup.object().shape({
  newPassword: passwordRule,
  confirmPassword: yup
    .string()
    .required('La confirmation du mot de passe est obligatoire')
    .oneOf([yup.ref('newPassword')], 'Les mots de passe ne correspondent pas'),
})

export const registerSchema = yup.object().shape({
  prenom: yup.string().required('Le prénom est obligatoire'),
  nom: yup.string().required('Le nom est obligatoire'),
  email: emailRule,
  password: passwordRule,
})

export const clientSchema = yup.object().shape({
  nom: yup.string().required('Le nom est obligatoire'),
  email: emailRule,
  telephone: yup.string().optional(),
  ville: yup.string().optional(),
})

export const productSchema = yup.object().shape({
  nom: yup.string().required('Le nom est obligatoire'),
  categorie: yup.string().required('La catégorie est obligatoire'),
  prix: yup
    .number()
    .typeError('Le prix doit être un nombre')
    .required('Le prix est obligatoire')
    .min(0, 'Le prix ne peut pas être négatif'),
  quantiteStock: yup
    .number()
    .typeError('La quantité doit être un nombre')
    .required('La quantité est obligatoire')
    .integer('La quantité doit être un entier')
    .min(0, 'La quantité ne peut pas être négative'),
})

export const orderSchema = yup.object().shape({
  clientId: yup
    .number()
    .typeError('Veuillez sélectionner un client')
    .required('Veuillez sélectionner un client'),
})

export const userSchema = yup.object().shape({
  prenom: yup.string().required('Le prénom est obligatoire'),
  nom: yup.string().required('Le nom est obligatoire'),
  email: emailRule,
  password: passwordRule,
  role: yup.string().required('Le rôle est obligatoire'),
})

export const addProductLineSchema = yup.object().shape({
  produitId: yup.string().required('Veuillez choisir un produit'),
  quantite: yup
    .number()
    .typeError('La quantité doit être un nombre')
    .required('La quantité est obligatoire')
    .positive('La quantité doit être supérieure à 0')
    .integer('La quantité doit être un entier'),
})
