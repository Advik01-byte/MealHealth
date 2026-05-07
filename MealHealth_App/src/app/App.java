package app;

import javax.swing.SwingUtilities;

import ui.MealHealthFrame;

public class App {
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            MealHealthFrame frame = new MealHealthFrame();
            frame.setVisible(true);
        });
    }
}
