// `src/models/fakeUser.model.mjs`
import mongoose from 'mongoose';

const fakeUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

export default mongoose.model('FakeUser', fakeUserSchema);