/**
 * Anil Verman
 */
import 'dotenv/config';
import express from 'express';
import asyncHandler from 'express-async-handler';
import * as exercises from './exercises_model.mjs';

const ERROR_NOT_FOUND = {Error: "Not found"};
const ERROR_INVALID_REQUEST = { Error: "Invalid request"};

const PORT = process.env.PORT;
const app = express();

app.use(express.json());

app.listen(PORT, async () => {
    await exercises.connect()
    console.log(`Server listening on port ${PORT}...`);
});


/**
 * Create a new exercise with the query parameters provided in the body
 */
app.post('/exercises', asyncHandler(async (req, res) => {
    if (!exercises.arePropertiesValid(req.body.name, 
                            req.body.reps, 
                            req.body.weight,
                            req.body.unit,
                            req.body.date)) {
        return res.status(400).json(ERROR_INVALID_REQUEST);
    } 

    const exercise = await exercises.createExercise(req.body.name, 
                            req.body.reps, 
                            req.body.weight,
                            req.body.unit,
                            req.body.date);
    res.status(201).json(exercise);
}));

/**
 * Read from database list return all exercises
 */
app.get('/exercises', asyncHandler(async (req, res) => {
    const exercise_array = await exercises.getExercise();
    res.status(200).json(exercise_array);
}));

/**
 * Read from database with path parameter: ID of the exercise to retrieve.
 */
app.get('/exercises/:id', asyncHandler(async (req, res) => {
    const id = req.params.id;
    const exercise = await exercises.getExerciseByID(id);

    if (!exercise){
        //error response
        res.status(404).json(ERROR_NOT_FOUND)
    } else {
        res.status(200).json(exercise);
    }
}));

/**
 * Update database with path parameter: ID of the exercise to retrieve.
 */
app.put('/exercises/:id', asyncHandler(async (req, res) => {
    if (!exercises.arePropertiesValid(req.body.name, 
                                req.body.reps, 
                                req.body.weight,
                                req.body.unit,
                                req.body.date)) {
        return res.status(400).json(ERROR_INVALID_REQUEST);
    }

    const id = req.params.id;
    const updated_prop = req.body; // properties to be updated

    await exercises.updateByID(id, updated_prop); // update exercise
    const updated_exercise = await exercises.getExerciseByID(id); // retrieve updated exercise

    if (!updated_exercise){
        //error response
        res.status(404).json(ERROR_NOT_FOUND)
    } else {
        res.status(200).json(updated_exercise);
    }
}));

/**
 * Delete from database with ID.
 */
app.delete('/exercises/:id', asyncHandler(async (req, res) => {
    const id = req.params.id;
    const delete_count = await exercises.deleteExerciseByID(id);

    if (delete_count == 0){
        //error response
        res.status(404).json(ERROR_NOT_FOUND)
    } else {
        res.status(204).send();
    }
}));