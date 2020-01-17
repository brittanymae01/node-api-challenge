const express = require("express");

const router = express.Router();

const Actions = require("../helpers/actionModel");
const Projects = require("../helpers/projectModel");

router.get("/", (req, res) => {
  Actions.get()
    .then(allActions => {
      return res.status(200).json(allActions);
    })
    .catch(error => {
      console.log(error);
      return res.status(500).json({
        errorMessage: "There was a problem retreiving the data"
      });
    });
});

// router.get("/:id", (req, res) => {
//   Actions.get(req.params.id)
//     .then(actions => {
//       return res.status(200).json(actions);
//     })
//     .catch(error => {
//       console.log(error);
//       return res.status(500).json({
//         errorMessage: "the project information could not be retreived"
//       });
//     });
// });

router.get("/:id", (req, res) => {
  Projects.getProjectActions(req.params.id)
    .then(projectsActions => {
      if (projectsActions.length === 0) {
        return res.status(404).json({
          errorMessage: "user id does not exist"
        });
      } else {
        return res.status(200).json(projectsActions);
      }
    })
    .catch(error => {
      console.log(error);
      return res.status(500).json({
        errorMessage: "the project information could not be retreived"
      });
    });
});

router.put("/:id", (req, res) => {
  Actions.update(req.params.id, req.body)
    .then(updated => {
      if (!updated) {
        res.status(404).json({ message: "Could not edit, does not exist!" });
      } else {
        res.status(200).json(updated);
      }
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: "problems updating action" });
    });
});

router.delete("/:id", (req, res) => {
  Actions.remove(req.params.id)
    .then(deleted => {
      return res.status(200).json({
        deleted: `${deleted}`,
        url: `api/project/${req.params.id}`,
        operation: `DElETE for project with id ${req.params.id}`
      });
    })
    .catch(error => {
      console.log(error);
      return res.status(500).json({
        errorMessage: "problem deleting project"
      });
    });
});

module.exports = router;
