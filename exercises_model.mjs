/**
 * Anil Verman
 */
import mongoose from 'mongoose';
import 'dotenv/config';

const EXERCISE_DB_NAME = 'exercise_db';

let connection = undefined;

/**
 * This function connects to the MongoDB server and to the database
 *  'exercise_db' in that server.
 */
async function connect(){
    try{
        connection = await mongoose.connect(process.env.MONGODB_CONNECT_STRING, 
                {dbName: EXERCISE_DB_NAME});
        console.log("Successfully connected to MongoDB using Mongoose!");
    } catch(err){
        console.log(err);
        throw Error(`Could not connect to MongoDB ${err.message}`)
    }
}


/**
 * Define the schema
 */
const exerciseSchema = mongoose.Schema({
    // TODO: Define the schema to represent users
    name: { type: String, required: true },
    reps: { type: Number, required: true },
    weight: { type: Number, required: true },
    unit: { type: String, required: true },
    date: { type: String, required: true }
});

/**
 * Compile the model from the schema. This must be done after defining the schema.
 */
const Excerice = mongoose.model(EXERCISE_DB_NAME, exerciseSchema);


/**
 * Create a exercise
 * @param {String} name
 * @param {Number} reps 
 * @param {Number} weight
 * @param {String} unit
 * @param {String} date
 * @returns A promise. Resolves to the JSON object for the document created by calling save
 */
const createExercise = async (name, reps, weight, unit, date) => {
    // Call the constructor to create an instance of the model class User
    const excercise = new Excerice({ name: name, reps: reps, weight: weight, unit: unit, date: date });
    // Call save to persist this object as a document in MongoDB
    return excercise.save();
}

/**
 * Get excercise(s) by optional parameters
 * @param optional_filter
 * @returns A promise. Resolves to the array containing all users or just the exercies specified by the optional_filter paramaters
 */
const getExercise = async () => {
    const exercise_array = await Excerice.find() // return all exercises in array that meet the filter requirements
    return exercise_array
}

/**
 * Get user by ID
 * @param {Number} id
 * @returns A promise. Resolves to the exercise object specified by the given ID
 */
const getExerciseByID = async (id) => {
    const exercise = await Excerice.findById(id) // return all exercises in array that meet the filter requirements
    return exercise
}

/**
 * Update user by ID and with provided properties to update
 * @param {Number} id
 * @param update_prop
 * @returns A promise. Resolves to the updated user object specified by the given ID, and with updated properties provided
 */
const updateByID = async (id, update_prop) => {
    let filter = {_id: id};
    await Excerice.updateOne(filter, update_prop);
}

/**
 * Delete exercise by ID
 * @param id
 * @returns A promise. Resolves delete the specified exercise
 */
const deleteExerciseByID = async (id) => {
    let filter = {_id: id};
    const result = await Excerice.deleteOne(filter);
    return result.deletedCount
}

/**
*
* @param {String} name property must be a string containing at least one character (i.e., it can't be empty or a null string).
* @param {Number} reps property must be an integer greater than 0.
* @param {Number} weight property must be an integer greater than 0.
* @param {String} unit property must be either the string kgs or the string lbs
* @param {String} date property must be a string in the format MM-DD-YY, where MM, DD and YY are 2-digit integers
* Return true if the 5 properties of exercise are valid
*/
function arePropertiesValid (name, reps, weight, unit, date) {
    if (typeof name !== 'string' || name.trim() === '' || name === null) {
        return false
    }

    if (typeof reps !== 'number' || reps <= 0) {
        return false
    }

    if (typeof weight !== 'number' || weight <= 0) {
        return false
    }

    if (unit !== 'lbs' && unit !== 'kgs') {
        return false
    }

    if (!_isDateValid(date)) {
        return false
    }

    return true
}

/**
*
* @param {string} date
* Return true if the date format is MM-DD-YY where MM, DD and YY are 2 digit integers
*/
function _isDateValid(date) {
    // Test using a regular expression. 
    // To learn about regular expressions see Chapter 6 of the text book
    const format = /^\d\d-\d\d-\d\d$/;
    return format.test(date);
}

export { connect, createExercise, getExercise, getExerciseByID, updateByID, deleteExerciseByID, arePropertiesValid };