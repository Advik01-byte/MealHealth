package model;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public final class MealHealthModel {
    private MealHealthModel() {
    }

    public enum DietGoal {
        BALANCED("Balanced"),
        MUSCLE_GAIN("Muscle gain"),
        WEIGHT_LOSS("Weight loss"),
        ENERGY("Energy boost"),
        VEGGIE_FOCUS("Veggie focus");

        final String label;

        DietGoal(String label) {
            this.label = label;
        }

        @Override
        public String toString() {
            return label;
        }
    }

    public enum MealTime {
        BREAKFAST("Breakfast"),
        LUNCH("Lunch"),
        DINNER("Dinner"),
        SNACK("Snack");

        final String label;

        MealTime(String label) {
            this.label = label;
        }

        @Override
        public String toString() {
            return label;
        }
    }

    public enum MealComplexity {
        SIMPLE("Simple"),
        MODERATE("Moderate"),
        CREATIVE("Creative");

        final String label;

        MealComplexity(String label) {
            this.label = label;
        }

        @Override
        public String toString() {
            return label;
        }
    }

    public static final class MealProfile {
        public final DietGoal goal;
        public final MealTime mealTime;
        public final MealComplexity complexity;
        public final boolean highProtein;
        public final boolean dairyFree;
        public final boolean nutFree;
        public final boolean under30Minutes;

        public MealProfile(DietGoal goal, MealTime mealTime, MealComplexity complexity, boolean highProtein,
                boolean dairyFree, boolean nutFree, boolean under30Minutes) {
            this.goal = goal;
            this.mealTime = mealTime;
            this.complexity = complexity;
            this.highProtein = highProtein;
            this.dairyFree = dairyFree;
            this.nutFree = nutFree;
            this.under30Minutes = under30Minutes;
        }

        public List<String> tags() {
            List<String> tags = new ArrayList<>();
            tags.add(goal.label);
            tags.add(mealTime.label);
            tags.add(complexity.label);
            if (highProtein) tags.add("high protein");
            if (dairyFree) tags.add("dairy free");
            if (nutFree) tags.add("nut free");
            if (under30Minutes) tags.add("quick");
            return tags;
        }
    }

    public static final class MealRecommendation {
        private final String consensusTitle;
        private final int consensusScore;
        private final String consensusSummary;
        private final List<String> modelOutputs;
        private final String ingredientsText;

        public MealRecommendation(String consensusTitle, int consensusScore, String consensusSummary,
                List<String> modelOutputs, String ingredientsText) {
            this.consensusTitle = consensusTitle;
            this.consensusScore = consensusScore;
            this.consensusSummary = consensusSummary;
            this.modelOutputs = modelOutputs;
            this.ingredientsText = ingredientsText;
        }

        public String getConsensusTitle() {
            return consensusTitle;
        }

        public int getConsensusScore() {
            return consensusScore;
        }

        public String getConsensusSummary() {
            return consensusSummary;
        }

        public List<String> getModelOutputs() {
            return modelOutputs;
        }

        public String getIngredientsText() {
            return ingredientsText;
        }
    }

    public static final class MealSuggestionEngine {
        public MealRecommendation recommend(MealProfile profile) {
            String[] options = optionsFor(profile);
            String base = chooseBase(profile);
            String protein = profile.highProtein ? "grilled tofu" : "chickpeas";
            String garnish = profile.goal == DietGoal.WEIGHT_LOSS ? "greens and lemon" : "avocado and herbs";
            String carbs = profile.mealTime == MealTime.BREAKFAST ? "oats and berries" : "brown rice";

            List<String> modelOutputs = Arrays.asList(
                    "Nutrition model: prioritize " + protein + ", " + carbs + ", and plenty of vegetables.",
                    "Fitness model: choose " + base + " with clean macros and a filling portion size.",
                    "Simplicity model: keep it easy with one bowl, one sauce, and a 20-minute prep.");

            String title = options[0];
            int score = computeScore(profile);
            String summary = "Recommended meal: " + title + ".\n\n" +
                    "Why it fits:\n" +
                    "- " + capitalize(profile.goal.label) + " goal\n" +
                    "- " + profile.mealTime.label + " timing\n" +
                    "- " + profile.complexity.label + " preparation\n" +
                    (profile.highProtein ? "- High protein included\n" : "") +
                    (profile.dairyFree ? "- Dairy is excluded\n" : "") +
                    (profile.nutFree ? "- Nut-safe option\n" : "") +
                    (profile.under30Minutes ? "- Designed to stay under 30 minutes\n" : "") +
                    "\nConsensus: a balanced bowl with " + protein + ", " + carbs + ", " + garnish + ".";

            String ingredients = String.join("\n", Arrays.asList(
                    "Suggested ingredients:",
                    "- " + protein,
                    "- " + carbs,
                    "- spinach or mixed greens",
                    "- cucumber, tomato, or roasted vegetables",
                    "- olive oil or yogurt-based sauce",
                    "- " + garnish));

            return new MealRecommendation(title, score, summary, modelOutputs, ingredients);
        }

        private String[] optionsFor(MealProfile profile) {
            if (profile.goal == DietGoal.MUSCLE_GAIN) {
                return new String[] { "Protein power bowl", "Chicken quinoa bowl", "Tofu satay bowl" };
            }
            if (profile.goal == DietGoal.WEIGHT_LOSS) {
                return new String[] { "Green detox bowl", "Salmon salad bowl", "Lentil veggie bowl" };
            }
            if (profile.goal == DietGoal.ENERGY) {
                return new String[] { "Rainbow grain bowl", "Turkey rice bowl", "Greek-style bowl" };
            }
            if (profile.goal == DietGoal.VEGGIE_FOCUS) {
                return new String[] { "Mediterranean veg bowl", "Roasted chickpea bowl", "Zucchini noodle bowl" };
            }
            return new String[] { "Balanced nourish bowl", "Chicken avocado bowl", "Bean and rice bowl" };
        }

        private String chooseBase(MealProfile profile) {
            if (profile.goal == DietGoal.MUSCLE_GAIN) return "Protein";
            if (profile.goal == DietGoal.WEIGHT_LOSS) return "Lean greens";
            if (profile.goal == DietGoal.ENERGY) return "Power";
            if (profile.goal == DietGoal.VEGGIE_FOCUS) return "Garden";
            return "Balanced";
        }

        private int computeScore(MealProfile profile) {
            int score = 72;
            if (profile.highProtein) score += 8;
            if (profile.dairyFree) score += 4;
            if (profile.nutFree) score += 3;
            if (profile.under30Minutes) score += 6;
            if (profile.complexity == MealComplexity.SIMPLE) score += 4;
            if (profile.complexity == MealComplexity.CREATIVE) score -= 2;
            if (score > 100) score = 100;
            return score;
        }

        private String capitalize(String text) {
            if (text == null || text.isEmpty()) {
                return text;
            }
            return Character.toUpperCase(text.charAt(0)) + text.substring(1);
        }
    }
}
