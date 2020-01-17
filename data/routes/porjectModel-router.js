const express = require("express");

const router = express.Router();

const Projects = require("../helpers/projectModel");
const Actions = require("../helpers/actionModel");

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

router.get("/:id", validateUserId, (req, res) => {
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

// validation is not working

router.post("/", (req, res) => {
  const { name, description } = req.body;

  Projects.insert(req.body)
    .then(project => {
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
        return res.status(201).json(project);
      }
    })
    .catch(error => {
      console.log(error);
      return res.status(500).json({
        errorMessage: "problem adding project"
      });
    });
});

router.post("/:id/actions", (req, res) => {
  const projectInfo = { ...req.body, project_id: req.params.id };

  Actions.insert(projectInfo)
    .then(post => {
      return res.status(201).json(post);
    })
    .catch(error => {
      console.log(error);
      return res.status(500).json({
        errorMessage: "problem adding post"
      });
    });
});

router.delete("/:id", (req, res) => {
  Projects.remove(req.params.id)
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

router.put("/:id", (req, res) => {
  const { name, description } = req.body;
  Projects.update(req.params.id, req.body)
    .then(updated => {
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
        Projects.get(req.params.id).then(project =>
          res.status(200).json(project)
        );
      }
    })
    .catch(error => {
      console.log(error);
      return res
        .status(500)
        .json({ error: "The post information could not be modified." });
    });
});

function validateUserId(req, res, next) {
  Projects.get(req.params.id).then(project => {
    if (!project) {
      res.status(404).json({ message: "invalid user id" });
    } else {
      req.project = project;
    }
  });
  next();
}

module.exports = router;
