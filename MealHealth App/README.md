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
javac src\\*.java
java -cp src App
```

## Files

- `src/App.java` - app entry point
- `src/MealHealthFrame.java` - Swing UI
- `src/MealHealthModel.java` - meal data and recommendation logic

## Notes

This is a prototype only. It does not call real AI models yet. The goal is to demonstrate the product idea and interface flow.
