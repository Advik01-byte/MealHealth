package ui;

import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;

import javax.swing.BorderFactory;
import javax.swing.Box;
import javax.swing.BoxLayout;
import javax.swing.DefaultComboBoxModel;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JCheckBox;
import javax.swing.JComponent;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextArea;
import javax.swing.UIManager;
import javax.swing.border.EmptyBorder;
import javax.swing.border.LineBorder;

import model.MealHealthModel;

public class MealHealthFrame extends JFrame {
    private static final Color BG_TOP = new Color(0xF7F2E8);
    private static final Color BG_BOTTOM = new Color(0xEEF6F2);
    private static final Color CARD = new Color(0xFFFFFF);
    private static final Color TEXT = new Color(0x19322F);
    private static final Color MUTED = new Color(0x667A71);
    private static final Color BRAND = new Color(0x1F5B52);
    private static final Color BRAND_DARK = new Color(0x15433E);
    private static final Color ACCENT = new Color(0xD98C5F);
    private static final Color ACCENT_SOFT = new Color(0xF4DDD0);
    private static final Color SOFT_MINT = new Color(0xD9ECE4);
    private static final Color FIELD_BG = new Color(0xFBFCFB);
    private static final Color BORDER = new Color(0xDDE6E1);

    private final JComboBox<MealHealthModel.DietGoal> goalBox;
    private final JComboBox<MealHealthModel.MealComplexity> complexityBox;
    private final JComboBox<MealHealthModel.MealTime> mealTimeBox;
    private final JCheckBox highProteinBox;
    private final JCheckBox dairyFreeBox;
    private final JCheckBox nutFreeBox;
    private final JCheckBox under30MinutesBox;

    private final JTextArea summaryArea;
    private final JTextArea modelOneArea;
    private final JTextArea modelTwoArea;
    private final JTextArea modelThreeArea;
    private final JTextArea ingredientsArea;
    private final JLabel consensusLabel;
    private final JLabel scoreLabel;

    private final MealHealthModel.MealSuggestionEngine engine = new MealHealthModel.MealSuggestionEngine();

    public MealHealthFrame() {
        setTitle("MealHealth Prototype");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setMinimumSize(new Dimension(1180, 760));
        setLocationRelativeTo(null);

        installTheme();

        JPanel root = new GradientPanel();
        root.setLayout(new BorderLayout(18, 18));
        root.setBorder(new EmptyBorder(18, 18, 18, 18));
        setContentPane(root);

        root.add(buildHeader(), BorderLayout.NORTH);
        root.add(buildBody(), BorderLayout.CENTER);

        goalBox = new JComboBox<>(new DefaultComboBoxModel<>(MealHealthModel.DietGoal.values()));
        complexityBox = new JComboBox<>(new DefaultComboBoxModel<>(MealHealthModel.MealComplexity.values()));
        mealTimeBox = new JComboBox<>(new DefaultComboBoxModel<>(MealHealthModel.MealTime.values()));
        highProteinBox = new JCheckBox("High protein");
        dairyFreeBox = new JCheckBox("Dairy free");
        nutFreeBox = new JCheckBox("Nut free");
        under30MinutesBox = new JCheckBox("Under 30 minutes");

        summaryArea = createOutputArea();
        modelOneArea = createOutputArea();
        modelTwoArea = createOutputArea();
        modelThreeArea = createOutputArea();
        ingredientsArea = createOutputArea();
        consensusLabel = new JLabel("Ready to generate a meal plan");
        consensusLabel.setFont(new Font("SansSerif", Font.BOLD, 24));
        consensusLabel.setForeground(BRAND_DARK);
        consensusLabel.setOpaque(true);
        consensusLabel.setBackground(ACCENT_SOFT);
        consensusLabel.setBorder(new EmptyBorder(10, 14, 10, 14));
        scoreLabel = new JLabel("Consensus score: -");
        scoreLabel.setFont(new Font("SansSerif", Font.PLAIN, 14));
        scoreLabel.setForeground(MUTED);

        root.add(buildControls(), BorderLayout.WEST);
        root.add(buildResults(), BorderLayout.CENTER);

        wireActions();
        generatePlan();
    }

    private void installTheme() {
        UIManager.put("Label.font", new Font("SansSerif", Font.PLAIN, 14));
        UIManager.put("Button.font", new Font("SansSerif", Font.BOLD, 14));
        UIManager.put("ComboBox.font", new Font("SansSerif", Font.PLAIN, 14));
        UIManager.put("CheckBox.font", new Font("SansSerif", Font.PLAIN, 14));
        UIManager.put("TextArea.font", new Font("SansSerif", Font.PLAIN, 14));
        UIManager.put("ComboBox.background", FIELD_BG);
        UIManager.put("ComboBox.foreground", TEXT);
        UIManager.put("TextArea.background", FIELD_BG);
    }

    private JPanel buildHeader() {
        JPanel header = new JPanel(new BorderLayout());
        header.setOpaque(false);

        JPanel brand = new JPanel();
        brand.setOpaque(false);
        brand.setLayout(new BoxLayout(brand, BoxLayout.Y_AXIS));

        JLabel title = new JLabel("MealHealth");
        title.setFont(new Font("SansSerif", Font.BOLD, 34));
        title.setForeground(BRAND_DARK);

        JLabel subtitle = new JLabel("AI-assisted healthy meal prototype for personalized nutrition");
        subtitle.setFont(new Font("SansSerif", Font.PLAIN, 15));
        subtitle.setForeground(MUTED);

        brand.add(title);
        brand.add(Box.createVerticalStrut(6));
        brand.add(subtitle);

        JLabel badge = new JLabel("Prototype");
        badge.setOpaque(true);
        badge.setBackground(ACCENT_SOFT);
        badge.setForeground(BRAND_DARK);
        badge.setBorder(new EmptyBorder(8, 14, 8, 14));
        badge.setFont(new Font("SansSerif", Font.BOLD, 13));

        header.add(brand, BorderLayout.WEST);
        header.add(badge, BorderLayout.EAST);
        return header;
    }

    private JPanel buildBody() {
        JPanel body = new JPanel(new BorderLayout(18, 18));
        body.setOpaque(false);
        return body;
    }

    private JPanel buildControls() {
        JPanel panel = new JPanel();
        panel.setLayout(new BoxLayout(panel, BoxLayout.Y_AXIS));
        panel.setPreferredSize(new Dimension(320, 0));
        panel.setBackground(CARD);
        panel.setBorder(new CompoundRoundedBorder());

        panel.add(sectionTitle("Meal Preferences"));
        panel.add(Box.createVerticalStrut(12));

        panel.add(labeledField("Goal", goalBox));
        panel.add(Box.createVerticalStrut(10));
        panel.add(labeledField("Meal time", mealTimeBox));
        panel.add(Box.createVerticalStrut(10));
        panel.add(labeledField("Complexity", complexityBox));

        panel.add(Box.createVerticalStrut(18));
        panel.add(sectionTitle("Diet filters"));
        panel.add(Box.createVerticalStrut(12));
        panel.add(checkboxRow(highProteinBox));
        panel.add(checkboxRow(dairyFreeBox));
        panel.add(checkboxRow(nutFreeBox));
        panel.add(checkboxRow(under30MinutesBox));

        panel.add(Box.createVerticalStrut(18));

        JButton generate = primaryButton("Generate meal");
        panel.add(generate);
        panel.add(Box.createVerticalStrut(10));

        JButton reset = secondaryButton("Reset");
        panel.add(reset);
        panel.add(Box.createVerticalStrut(16));

        JTextArea note = new JTextArea(
                "This prototype simulates three model opinions, then combines them into one meal suggestion.");
        note.setLineWrap(true);
        note.setWrapStyleWord(true);
        note.setEditable(false);
        note.setOpaque(false);
        note.setForeground(MUTED);
        note.setBorder(new EmptyBorder(10, 2, 0, 2));

        panel.add(note);

        generate.addActionListener(e -> generatePlan());
        reset.addActionListener(e -> resetFields());

        return panel;
    }

    private JPanel buildResults() {
        JPanel panel = new JPanel(new BorderLayout(16, 16));
        panel.setOpaque(false);

        JPanel topCard = new JPanel(new BorderLayout(10, 10));
        topCard.setBackground(CARD);
        topCard.setBorder(new CompoundRoundedBorder());
        topCard.add(consensusLabel, BorderLayout.NORTH);
        topCard.add(scoreLabel, BorderLayout.SOUTH);

        summaryArea.setRows(4);
        summaryArea.setText("");
        summaryArea.setBackground(new Color(0xF8F4EC));
        topCard.add(wrapArea(summaryArea), BorderLayout.CENTER);

        JPanel modelGrid = new JPanel(new GridBagLayout());
        modelGrid.setOpaque(false);

        GridBagConstraints gbc = new GridBagConstraints();
        gbc.insets = new Insets(0, 0, 0, 0);
        gbc.fill = GridBagConstraints.BOTH;
        gbc.weightx = 1;
        gbc.weighty = 1;

        addModelCard(modelGrid, gbc, "Model A: Nutrition", modelOneArea, 0, 0);
        addModelCard(modelGrid, gbc, "Model B: Fitness", modelTwoArea, 1, 0);
        addModelCard(modelGrid, gbc, "Model C: Simplicity", modelThreeArea, 0, 1);
        addIngredientCard(modelGrid, gbc, ingredientsArea, 1, 1);

        panel.add(topCard, BorderLayout.NORTH);
        panel.add(modelGrid, BorderLayout.CENTER);
        return panel;
    }

    private void wireActions() {
        goalBox.addActionListener(e -> generatePlan());
        complexityBox.addActionListener(e -> generatePlan());
        mealTimeBox.addActionListener(e -> generatePlan());
        highProteinBox.addActionListener(e -> generatePlan());
        dairyFreeBox.addActionListener(e -> generatePlan());
        nutFreeBox.addActionListener(e -> generatePlan());
        under30MinutesBox.addActionListener(e -> generatePlan());
    }

    private void generatePlan() {
        MealHealthModel.MealProfile profile = new MealHealthModel.MealProfile(
                (MealHealthModel.DietGoal) goalBox.getSelectedItem(),
                (MealHealthModel.MealTime) mealTimeBox.getSelectedItem(),
                (MealHealthModel.MealComplexity) complexityBox.getSelectedItem(),
                highProteinBox.isSelected(),
                dairyFreeBox.isSelected(),
                nutFreeBox.isSelected(),
                under30MinutesBox.isSelected());

        MealHealthModel.MealRecommendation recommendation = engine.recommend(profile);

        consensusLabel.setText(recommendation.getConsensusTitle());
        scoreLabel.setText("Consensus score: " + recommendation.getConsensusScore() + "/100");
        scoreLabel.setForeground(recommendation.getConsensusScore() >= 85 ? BRAND : MUTED);
        summaryArea.setText(recommendation.getConsensusSummary());
        modelOneArea.setText(recommendation.getModelOutputs().get(0));
        modelTwoArea.setText(recommendation.getModelOutputs().get(1));
        modelThreeArea.setText(recommendation.getModelOutputs().get(2));
        ingredientsArea.setText(recommendation.getIngredientsText());
    }

    private void resetFields() {
        goalBox.setSelectedIndex(0);
        complexityBox.setSelectedIndex(1);
        mealTimeBox.setSelectedIndex(0);
        highProteinBox.setSelected(false);
        dairyFreeBox.setSelected(false);
        nutFreeBox.setSelected(false);
        under30MinutesBox.setSelected(false);
        generatePlan();
    }

    private JTextArea createOutputArea() {
        JTextArea area = new JTextArea();
        area.setLineWrap(true);
        area.setWrapStyleWord(true);
        area.setEditable(false);
        area.setBackground(new Color(0xF8FAF9));
        area.setBorder(new EmptyBorder(12, 12, 12, 12));
        area.setForeground(TEXT);
        area.setFont(new Font("SansSerif", Font.PLAIN, 14));
        return area;
    }

    private JScrollPane wrapArea(JTextArea area) {
        JScrollPane scrollPane = new JScrollPane(area);
        scrollPane.setBorder(BorderFactory.createEmptyBorder());
        scrollPane.getViewport().setBackground(Color.WHITE);
        scrollPane.setPreferredSize(new Dimension(640, 130));
        return scrollPane;
    }

    private void addModelCard(JPanel parent, GridBagConstraints gbc, String title, JTextArea area, int gridx, int gridy) {
        gbc.gridx = gridx;
        gbc.gridy = gridy;
        gbc.weightx = 1;
        gbc.weighty = 1;
        gbc.insets = new Insets(gridy == 0 ? 0 : 14, gridx == 0 ? 0 : 14, 0, 0);

        JPanel card = new JPanel(new BorderLayout(8, 8));
        card.setBackground(CARD);
        card.setBorder(new CompoundRoundedBorder());

        JLabel heading = new JLabel(title);
        heading.setFont(new Font("SansSerif", Font.BOLD, 15));
        heading.setForeground(BRAND_DARK);
        heading.setBorder(new EmptyBorder(4, 4, 0, 4));

        card.add(heading, BorderLayout.NORTH);
        card.add(wrapArea(area), BorderLayout.CENTER);
        parent.add(card, gbc);
    }

    private void addIngredientCard(JPanel parent, GridBagConstraints gbc, JTextArea area, int gridx, int gridy) {
        gbc.gridx = gridx;
        gbc.gridy = gridy;
        gbc.weightx = 1;
        gbc.weighty = 1;
        gbc.insets = new Insets(gridy == 0 ? 0 : 14, gridx == 0 ? 0 : 14, 0, 0);

        JPanel card = new JPanel(new BorderLayout(8, 8));
        card.setBackground(CARD);
        card.setBorder(new CompoundRoundedBorder());

        JLabel heading = new JLabel("Smart grocery list");
        heading.setFont(new Font("SansSerif", Font.BOLD, 15));
        heading.setForeground(BRAND_DARK);
        heading.setBorder(new EmptyBorder(4, 4, 0, 4));

        card.add(heading, BorderLayout.NORTH);
        card.add(wrapArea(area), BorderLayout.CENTER);
        parent.add(card, gbc);
    }

    private JPanel labeledField(String label, JComponent field) {
        JPanel wrapper = new JPanel();
        wrapper.setLayout(new BoxLayout(wrapper, BoxLayout.Y_AXIS));
        wrapper.setOpaque(false);

        JLabel title = new JLabel(label);
        title.setForeground(MUTED);
        title.setAlignmentX(Component.LEFT_ALIGNMENT);
        field.setMaximumSize(new Dimension(Integer.MAX_VALUE, 34));
        field.setAlignmentX(Component.LEFT_ALIGNMENT);
        title.setBorder(new EmptyBorder(0, 2, 4, 2));

        wrapper.add(title);
        wrapper.add(field);
        return wrapper;
    }

    private JPanel checkboxRow(JCheckBox box) {
        JPanel row = new JPanel(new BorderLayout());
        row.setOpaque(false);
        box.setOpaque(false);
        box.setForeground(TEXT);
        row.add(box, BorderLayout.WEST);
        row.setBorder(new EmptyBorder(0, 0, 6, 0));
        return row;
    }

    private JLabel sectionTitle(String text) {
        JLabel title = new JLabel(text);
        title.setFont(new Font("SansSerif", Font.BOLD, 18));
        title.setForeground(BRAND_DARK);
        return title;
    }

    private JButton primaryButton(String text) {
        JButton button = new JButton(text);
        button.setBackground(BRAND);
        button.setForeground(Color.WHITE);
        button.setFocusPainted(false);
        button.setBorder(new EmptyBorder(12, 16, 12, 16));
        return button;
    }

    private JButton secondaryButton(String text) {
        JButton button = new JButton(text);
        button.setBackground(SOFT_MINT);
        button.setForeground(BRAND_DARK);
        button.setFocusPainted(false);
        button.setBorder(new EmptyBorder(12, 16, 12, 16));
        return button;
    }

    private static class CompoundRoundedBorder extends LineBorder {
        public CompoundRoundedBorder() {
            super(BORDER, 1, true);
        }
    }

    private static class GradientPanel extends JPanel {
        @Override
        protected void paintComponent(java.awt.Graphics g) {
            super.paintComponent(g);
            java.awt.Graphics2D g2 = (java.awt.Graphics2D) g.create();
            g2.setRenderingHint(java.awt.RenderingHints.KEY_ANTIALIASING,
                    java.awt.RenderingHints.VALUE_ANTIALIAS_ON);
            java.awt.GradientPaint paint = new java.awt.GradientPaint(0, 0, BG_TOP, 0, getHeight(), BG_BOTTOM);
            g2.setPaint(paint);
            g2.fillRect(0, 0, getWidth(), getHeight());
            g2.dispose();
        }
    }
}
