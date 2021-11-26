const auth = require('../auth')
const express = require('express')
const Top5ListController = require('../controllers/top5list-controller')
const UserController = require('../controllers/user-controller')
const router = express.Router()
/* Router should send all requests through verification middleware EXCEPT for getAlltop5lists, since
the guest should have access to the all lists, persons, and community aggregate list screens */
router.post('/top5list', auth.verify, Top5ListController.createTop5List)
router.put('/top5list/:id', auth.verify, Top5ListController.updateTop5List)
router.delete('/top5list/:id', auth.verify, Top5ListController.deleteTop5List)
router.get('/top5list/:id', auth.verify, Top5ListController.getTop5ListById)
router.get('/top5lists', Top5ListController.getTop5Lists)

router.post('/register', UserController.registerUser)
//Make a route for user login
router.post('/login', UserController.loginUser)
router.get('/loggedIn', UserController.getLoggedIn)
router.get('/logout', UserController.logoutUser)
module.exports = router