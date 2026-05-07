# MealHealth App Prototype

This is a standalone Java desktop prototype for **MealHealth**.

## What it does

- Lets a user choose a meal goal, meal time, and difficulty
- Applies diet filters like high protein, dairy free, nut free, and quick prep
- Simulates three "LLM" viewpoints
- Combines them into one suggested healthy meal

## Run it

Open the `MealHealth App` folder in VS Code and run:

```bash
javac -d out src\\app\\App.java src\\ui\\MealHealthFrame.java src\\model\\MealHealthModel.java
java -cp out app.App
```

## Files

- `src/app/App.java` - app entry point
- `src/ui/MealHealthFrame.java` - Swing UI
- `src/model/MealHealthModel.java` - meal data and recommendation logic

## Notes

This is a prototype only. It does not call real AI models yet. The goal is to demonstrate the product idea and interface flow.
