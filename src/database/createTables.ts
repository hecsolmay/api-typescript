import Objective from '../models/Objective'
import Practice from '../models/Practice'
import Test from '../models/Tests'
import User from '../models/Users'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import _Task from '../models/Task'

import { PracticeAnswer, TestAnswer } from '../models/Answers'
import { ContentTypes, TestTypes, UserTypes } from '../models/Types'
import { PracticeQuestion, TestQuestion, TestUsers } from '../models/UnionTables'

UserTypes.hasMany(User, { as: 'users', foreignKey: { allowNull: false, name: 'typeId', field: 'type_id' } })
User.belongsTo(UserTypes, { as: 'rol', foreignKey: { allowNull: false, name: 'typeId', field: 'type_id' } })

User.belongsToMany(Test, { through: TestUsers, foreignKey: { allowNull: false, name: 'userId', field: 'user_id' } })
Test.belongsToMany(User, { through: TestUsers, foreignKey: { allowNull: false, name: 'testId', field: 'test_id' } })
TestUsers.belongsTo(User, { foreignKey: 'userId' })
TestUsers.belongsTo(Test, { foreignKey: 'testId' })

TestTypes.hasMany(Test, { as: 'tests', foreignKey: { allowNull: false, name: 'testTypeId', field: 'test_type_id' } })
Test.belongsTo(TestTypes, { as: 'type', foreignKey: { allowNull: false, name: 'testTypeId', field: 'test_type_id' } })

TestTypes.hasMany(Practice, { foreignKey: { allowNull: false, name: 'testTypeId', field: 'test_type_id' } })
Practice.belongsTo(TestTypes, { foreignKey: { allowNull: false, name: 'testTypeId', field: 'test_type_id' } })

User.hasMany(Test, { as: 'test', foreignKey: { allowNull: false, name: 'experimenterId', field: 'experimenter_id' } })
Test.belongsTo(User, { as: 'experimenter', foreignKey: { allowNull: false, name: 'experimenterId', field: 'experimenter_id' } })

Test.hasMany(Practice, { as: 'practice', foreignKey: { name: 'testId', field: 'test_id' } })
Practice.belongsTo(Test, { as: 'test', foreignKey: { name: 'testId', field: 'test_id' } })

Test.hasMany(TestQuestion, { as: 'questions', foreignKey: { allowNull: false, name: 'testId', field: 'test_id' } })
TestQuestion.belongsTo(Test, { as: 'questions', foreignKey: { allowNull: false, name: 'testId', field: 'test_id' } })

TestQuestion.hasMany(TestAnswer, { foreignKey: { allowNull: false, name: 'testQuestionId', field: 'test_question_id' } })

Practice.hasMany(PracticeQuestion, { as: 'questions', foreignKey: { allowNull: false, name: 'practiceId', field: 'practice_id' } })
PracticeQuestion.hasMany(PracticeAnswer, { as: 'questions', foreignKey: { allowNull: false, name: 'practiceQuestionId', field: 'practice_question_id' } })

Objective.hasMany(PracticeQuestion, { foreignKey: { allowNull: false, name: 'objectiveId', field: 'objective_id' } })
PracticeQuestion.belongsTo(Objective, { foreignKey: { allowNull: false, name: 'objectiveId', field: 'objective_id' } })
Objective.hasMany(PracticeQuestion, { as: 'stimulusPractice', foreignKey: { allowNull: false, name: 'stimulusId', field: 'stimulus_id' } })
PracticeQuestion.belongsTo(Objective, { as: 'stimulus', foreignKey: { allowNull: false, name: 'stimulusId', field: 'stimulus_id' } })

Objective.hasMany(TestQuestion, { foreignKey: { allowNull: false, name: 'objectiveId', field: 'objective_id' } })
TestQuestion.belongsTo(Objective, { foreignKey: { allowNull: false, name: 'objectiveId', field: 'objective_id' } })
Objective.hasMany(TestQuestion, { as: 'stimulusTest', foreignKey: { allowNull: false, name: 'stimulusId', field: 'stimulus_id' } })
TestQuestion.belongsTo(Objective, { as: 'stimulus', foreignKey: { allowNull: false, name: 'stimulusId', field: 'stimulus_id' } })

ContentTypes.hasMany(Objective, { as: 'objectives', foreignKey: { allowNull: false, name: 'contentTypeId', field: 'content_type_id' } })
Objective.belongsTo(ContentTypes, { as: 'contentType', foreignKey: { allowNull: false, name: 'contentTypeId', field: 'content_type_id' } })
