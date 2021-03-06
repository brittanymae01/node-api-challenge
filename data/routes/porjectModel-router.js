const express = require("express");

const router = express.Router();

const Projects = require("../helpers/projectModel");
const Actions = require("../helpers/actionModel");

//working
router.get("/", (req, res) => {
  Projects.get()
    .then(allprojects => {
      return res.status(200).json(allprojects);
    })
    .catch(error => {
      console.log(error);
      return res.status(500).json({
        errorMessage: "There was a problem retreiving the data"
      });
    });
});

//working
router.get("/:id", validateProjectId, (req, res) => {
  Projects.get(req.params.id)
    .then(project => {
      return res.status(200).json(project);
    })
    .catch(error => {
      console.log(error);
      return res.status(500).json({
        errorMessage: "the project information could not be retreived"
      });
    });
});

// router.get("/:id", (req, res) => {
//   Projects.getProjectActions(req.params.id)
//     .then(projectsActions => {
//       if (projectsActions.length === 0) {
//         return res.status(404).json({
//           errorMessage: "user id does not exist"
//         });
//       } else {
//         return res.status(200).json(projectsActions);
//       }
//     })
//     .catch(error => {
//       console.log(error);
//       return res.status(500).json({
//         errorMessage: "the project information could not be retreived"
//       });
//     });
// });

//working
router.post("/", (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res.status(400).json({
      errorMessage: "please provide a name for the project"
    });
  }
  if (!description) {
    return res.status(400).json({
      errorMessage: "please provide a description for the project"
    });
  }
  Projects.insert(req.body)
    .then(project => {
      return res.status(201).json(project);
    })
    .catch(error => {
      console.log(error);
      return res.status(500).json({
        errorMessage: "problem adding project"
      });
    });
});

// working!
router.post("/:id/actions", (req, res) => {
  const projectInfo = { ...req.body, project_id: req.params.id };
  const { description, notes } = req.body;

  if (!description || !notes) {
    return res.status(404).json({
      errorMessage: "please provide description or notes"
    });
  }

  Projects.get(req.params.id)
    .then(project => {
      if (!project) {
        return res.status(404).json({
          errorMessage: "could not find project id"
        });
      } else {
        Actions.insert(projectInfo).then(action => {
          return res.status(201).json(action);
        });
      }
    })
    .catch(error => {
      console.log(error);
      return res.status(500).json({
        errorMessage: "problem adding post"
      });
    });
});

//no validation for project id

// router.post("/:id/actions", (req, res) => {
//   const projectInfo = { ...req.body, project_id: req.params.id };
//   const { description, notes } = req.body;

//   if (!description || !notes) {
//     return res.status(404).json({
//       errorMessage: "please provide description or notes"
//     });
//   }
//   Actions.insert(projectInfo)
//     .then(action => {
//       return res.status(201).json(action);
//     })
//     .catch(error => {
//       console.log(error);
//       return res.status(500).json({
//         errorMessage: "problem adding post"
//       });
//     });
// });

//working
router.delete("/:id", validateProjectId, (req, res) => {
  Projects.get(req.params.id)
    .then(project => {
      if (!project) {
        return res.status(404).json({
          errorMessage: "specified id does not exist"
        });
      }
      Projects.remove(req.params.id).then(deleted => {
        return res.status(200).json({
          deleted: `${deleted}`,
          url: `api/project/${req.params.id}`,
          operation: `DElETE for project with id ${req.params.id}`
        });
      });
    })
    .catch(error => {
      console.log(error);
      return res.status(500).json({
        errorMessage: "problem deleting project"
      });
    });
});

//working
router.put("/:id", (req, res) => {
  const { name, description } = req.body;
  Projects.update(req.params.id, req.body)
    .then(updated => {
      if (!updated) {
        return res.status(404).json({
          message: "The project with the specified ID does not exist."
        });
      }
      if (!name) {
        return res.status(400).json({
          errorMessage: "please provide a name for the project"
        });
      }
      if (!description) {
        return res.status(400).json({
          errorMessage: "please provide a description for the project"
        });
      } else {
        res.status(200).json(updated);
      }
    })
    .catch(error => {
      console.log(error);
      return res
        .status(500)
        .json({ error: "The post information could not be modified." });
    });
});

//only working for get i think it has to do with the req.project = project
function validateProjectId(req, res, next) {
  Projects.get(req.params.id).then(project => {
    if (!req.params.id) {
      res.status(404).json({ message: "invalid user id" });
    } else {
      req.project = project;
    }
  });
  next();
}

module.exports = router;
