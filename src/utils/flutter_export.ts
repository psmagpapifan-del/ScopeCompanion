// Helper template generator for migrating the Client Scoping Companion to Flutter + Stitch

export const FLUTTER_THEME_CODE = `import 'package:flutter/material.dart';

/// Design constants based on the Vibrant Palette design of the Scoping Companion.
/// Perfect for implementation using the Stitch design guide.
class CompanionTheme {
  static const Color background = Color(0xFFFFF9F2);
  static const Color textDark = Color(0xFF2D2D2D);
  static const Color textDeep = Color(0xFF1A1A1A);
  
  // Vibrant accents
  static const Color yellowAccent = Color(0xFFFFE66D);
  static const Color tealAccent = Color(0xFF4ECDC4);
  static const Color redAccent = Color(0xFFFF6B6B);
  static const Color blueAccent = Color(0xFFA0D2EB);
  static const Color orangePreset = Color(0xFFFFF9F2);
  static const Color yellowPreset = Color(0xFFFFD93D);

  static const Color borderDark = Color(0xFF2D3436);

  /// Heavy neo-brutalist border styling matching the companion's layout.
  static BoxDecoration neoBrutalistDecoration({
    required Color color,
    double borderRadius = 16.0,
    double shadowOffset = 4.0,
  }) {
    return BoxDecoration(
      color: color,
      borderRadius: BorderRadius.circular(borderRadius),
      border: Border.all(
        color: borderDark,
        width: 3.0,
      ),
      boxShadow: [
        BoxShadow(
          color: borderDark,
          offset: Offset(shadowOffset, shadowOffset),
          blurRadius: 0.0,
        ),
      ],
    );
  }

  /// Custom TextStyles for Stitch
  static TextStyle get displayHeader {
    return const TextStyle(
      fontSize: 22.0,
      fontWeight: FontWeight.extrabold,
      color: textDeep,
      letterSpacing: -0.5,
    );
  }

  static TextStyle get bodyBold {
    return const TextStyle(
      fontSize: 14.0,
      fontWeight: FontWeight.bold,
      color: textDark,
    );
  }
}
`;

export const FLUTTER_MODELS_CODE = `import 'dart:convert';

/// Represents a simple checklist item for onboarding milestones
class ChecklistItem {
  final String id;
  final String text;
  bool completed;
  String notes;

  ChecklistItem({
    required this.id,
    required this.text,
    this.completed = false,
    this.notes = '',
  });

  Map<String, dynamic> toMap() => {
    'id': id,
    'text': text,
    'completed': completed,
    'notes': notes,
  };

  factory ChecklistItem.fromMap(Map<String, dynamic> map) => ChecklistItem(
    id: map['id'] ?? '',
    text: map['text'] ?? '',
    completed: map['completed'] ?? false,
    notes: map['notes'] ?? '',
  );
}

/// Represents a major project phase milestone
class Milestone {
  final String phase;
  final String title;
  final String icon;
  final String desc;
  final String colorHex;
  final List<ChecklistItem> items;

  Milestone({
    required this.phase,
    required this.title,
    required this.icon,
    required this.desc,
    required this.colorHex,
    required this.items,
  });

  Map<String, dynamic> toMap() => {
    'phase': phase,
    'title': title,
    'icon': icon,
    'desc': desc,
    'colorHex': colorHex,
    'items': items.map((x) => x.toMap()).toList(),
  };

  factory Milestone.fromMap(Map<String, dynamic> map) => Milestone(
    phase: map['phase'] ?? '',
    title: map['title'] ?? '',
    icon: map['icon'] ?? '',
    desc: map['desc'] ?? '',
    colorHex: map['colorHex'] ?? '',
    items: List<ChecklistItem>.from(
      (map['items'] as List? ?? []).map((x) => ChecklistItem.fromMap(x)),
    ),
  );
}

/// Represents a conversational starter prompt
class Prompt {
  final String label;
  final String question;
  final String simpleExplanation;

  Prompt({
    required this.label,
    required this.question,
    required this.simpleExplanation,
  });
}

/// Represents a Category of discussion prompts
class PromptCategory {
  final String id;
  final String title;
  final String emoji;
  final Color primaryColor;
  final List<String> goals;
  final List<Prompt> prompts;

  PromptCategory({
    required this.id,
    required this.title,
    required this.emoji,
    required this.primaryColor,
    required this.goals,
    required this.prompts,
  });
}
`;

export const FLUTTER_DATA_CODE = `// Dart lists populated with the exact companion datasets for direct pasting

import 'package:flutter/material.dart';
import 'companion_models.dart'; // import matching your models file

final List<PromptCategory> discussionCategories = [
  PromptCategory(
    id: 'kickstart',
    title: '1. Kickstart & Core Value',
    emoji: '🚀',
    primaryColor: const Color(0xFFFFE66D),
    goals: [
      "Understand the 'Why' behind the project",
      "Explain software development simply to layman clients",
      "Separate core needs from shiny optional wishes"
    ],
    prompts: [
      Prompt(
        label: 'The Core Pain Point',
        question: 'What is the single biggest headache your users face today, and how does your software turn that headache into a smile?',
        simpleExplanation: "Why do users need this? Let's talk about their regular day and what makes them frustrated without this tool."
      ),
      Prompt(
        label: 'The Human Analogy',
        question: 'If your software was a real, helpful human standing in a room, what job title would they have? A diligent accountant, a fast delivery runner, or a protective security guard?',
        simpleExplanation: "Using an analogy helps us design the software's 'brain' and structure without getting lost in database jargon."
      ),
      Prompt(
        label: 'The Superpower Feature',
        question: 'If you could only build ONE single feature and nothing else, what would that feature be for the app to still be useful?',
        simpleExplanation: "This helps us identify the 'Heart' of your software. We can add more beautiful pages later, but let's make the heart beat first."
      )
    ]
  ),
  PromptCategory(
    id: 'scoping',
    title: '2. Scope & Target Audience',
    emoji: '🎯',
    primaryColor: const Color(0xFF4ECDC4),
    goals: [
      "Define who the actual users are",
      "Avoid 'Scope Creep' (making the app too complex before launching)",
      "Outline how the users will interact with the application"
    ],
    prompts: [
      Prompt(
        label: 'Understanding the Layman User',
        question: 'How technical is your average user? Do they use complex software every day, or do they get confused by standard login forms?',
        simpleExplanation: "This tells us if we need a complex settings page or if we should keep the app simple with large, direct buttons."
      ),
      Prompt(
        label: 'The \\'No-Go\\' list',
        question: 'What is one cool feature you saw on another app that we should explicitly agree NOT to build for the first release?',
        simpleExplanation: "By agreeing on what NOT to build, we save thousands of dollars and launch the app months earlier."
      ),
      Prompt(
        label: "User's Device Habit",
        question: 'Where will your clients open this software? Will they be sitting at an office desk with a big screen, or walking outside with a shaky phone?',
        simpleExplanation: "Mobile users need big touch buttons and offline-friendly features, while desktop users can handle rich data grids."
      )
    ]
  ),
  PromptCategory(
    id: 'tech_realities',
    title: '3. Tech Realities & Data Flow',
    emoji: '⚙️',
    primaryColor: const Color(0xFFFF6B6B),
    goals: [
      "Explain databases, logins, and API processes in simple terms",
      "Identify third-party integrations (payments, map locations, SMS)",
      "Secure user permissions and data collection boundaries"
    ],
    prompts: [
      Prompt(
        label: 'Explaining the Database (Storage)',
        question: 'What information does your app absolutely need to remember even when the user turns off their phone?',
        simpleExplanation: "Think of the database like a highly-organized digital filing cabinet. We only want to store files we need to read later."
      ),
      Prompt(
        label: 'Third-Party Helpers (APIs)',
        question: 'Should the app send real phone text alerts, process real credit cards, or fetch live map directions?',
        simpleExplanation: "Instead of building maps or payment systems from scratch (which costs a fortune), we hire external tools (like Stripe or Google Maps) to help us."
      ),
      Prompt(
        label: 'Security & Login Needs',
        question: 'How sensitive is the user data? Do we need bank-level security with code messages, or a simple email-and-password system?',
        simpleExplanation: "More security is great, but it adds steps for the client. Let's find the perfect balance of safety and ease."
      )
    ]
  ),
  PromptCategory(
    id: 'budget_timeline',
    title: '4. Budget & MVP Timelines',
    emoji: '💰',
    primaryColor: const Color(0xFFA0D2EB),
    goals: [
      "Align realistic budgets with project features",
      "Discuss maintenance costs (servers, domains, security)",
      "Plan the feedback cycle for testing early versions"
    ],
    prompts: [
      Prompt(
        label: 'The \\'Good-Enough\\' MVP Launch',
        question: 'Is it more important to launch a simpler app quickly to get user feedback, or wait longer to launch a highly polished product?',
        simpleExplanation: "We always recommend launching a 'Minimum Viable Product' (MVP) because real users will tell us what they actually want, saving us from building unused features."
      ),
      Prompt(
        label: 'Maintenance & Monthly Costs',
        question: 'Are you comfortable with standard monthly cloud server and subscription tool fees (like database hosting or email dispatch helpers)?',
        simpleExplanation: "Just like a physical shop requires rent and electricity, custom software has small monthly 'digital utility' costs to stay online."
      ),
      Prompt(
        label: 'Testing with Real People',
        question: 'Who are 3 friendly people in your circle who will test the very first rough draft of this software and give honest feedback?',
        simpleExplanation: "Early testing saves developers from writing the wrong code and ensures the final app is highly intuitive."
      )
    ]
  )
];

final List<Milestone> defaultMilestones = [
  Milestone(
    phase: 'Phase 1',
    title: 'The Initial Handshake',
    icon: '🤝',
    desc: 'Setting goals, signing basic agreements, and establishing smooth communication.',
    colorHex: '0xFFFFE66D',
    items: [
      ChecklistItem(id: 'p1-1', text: 'Sign Mutual NDA (keeps the client\\'s creative concept safe)'),
      ChecklistItem(id: 'p1-2', text: 'Define preferred communication channel (Slack, WhatsApp, Email)'),
      ChecklistItem(id: 'p1-3', text: 'Fill out the 5-Question Founders Questionnaire together'),
      ChecklistItem(id: 'p1-4', text: 'Explain target budget limits and realistic dev phases'),
    ],
  ),
  Milestone(
    phase: 'Phase 2',
    title: 'Feature Scoping & MVP',
    icon: '📐',
    desc: 'Deciding what features are \\'Must-Haves\\' for launch and what are \\'Nice-to-Haves\\'.',
    colorHex: '0xFF4ECDC4',
    items: [
      ChecklistItem(id: 'p2-1', text: 'Write the \\'One Sentence Goal\\' for the application'),
      ChecklistItem(id: 'p2-2', text: 'Identify the top 3 core features to build first (MVP Core)'),
      ChecklistItem(id: 'p2-3', text: 'Identify the 3 ideas that we are explicitly DELAYING for Phase 2'),
      ChecklistItem(id: 'p2-4', text: 'Discuss if database security, files, or payment processing is needed'),
    ],
  ),
  Milestone(
    phase: 'Phase 3',
    title: 'UX Design & Simple Flow',
    icon: '📱',
    desc: 'Drawing the screens and making sure non-native clients understand the user journey.',
    colorHex: '0xFFFF6B6B',
    items: [
      ChecklistItem(id: 'p3-1', text: 'Sketch wireframe shapes of the 3 primary screens'),
      ChecklistItem(id: 'p3-2', text: 'Verify button sizes and screen flow for mobile users'),
      ChecklistItem(id: 'p3-3', text: 'Review copy texts inside the app for simple, clear English'),
      ChecklistItem(id: 'p3-4', text: 'Client approves the screen visual layout drafts'),
    ],
  ),
];
`;

export const FLUTTER_API_CODE = `import 'dart:convert';
import 'package:http/http.dart' as http;

/// Client model for the simplified analogy result returned by Gemini API
class SimplifyResult {
  final String term;
  final String shortDefinition;
  final String analogyTitle;
  final String analogyText;
  final String simpleExplanation;
  final List<KeyPoint> keyPoints;
  final String? translation;

  SimplifyResult({
    required this.term,
    required this.shortDefinition,
    required this.analogyTitle,
    required this.analogyText,
    required this.simpleExplanation,
    required this.keyPoints,
    this.translation,
  });

  factory SimplifyResult.fromJson(Map<String, dynamic> json) {
    var keyPointsList = (json['keyPoints'] as List? ?? [])
        .map((x) => KeyPoint.fromJson(x))
        .toList();

    return SimplifyResult(
      term: json['term'] ?? '',
      shortDefinition: json['shortDefinition'] ?? '',
      analogyTitle: json['analogyTitle'] ?? '',
      analogyText: json['analogyText'] ?? '',
      simpleExplanation: json['simpleExplanation'] ?? '',
      keyPoints: keyPointsList,
      translation: json['translation'],
    );
  }
}

class KeyPoint {
  final String title;
  final String description;

  KeyPoint({required this.title, required this.description});

  factory KeyPoint.fromJson(Map<String, dynamic> json) {
    return KeyPoint(
      title: json['title'] ?? '',
      description: json['description'] ?? '',
    );
  }
}

/// Service handler to speak with the backend API route inside Flutter
class ScopingCompanionApi {
  // Replace this with your hosted dev or production backend URL
  static const String baseUrl = 'https://YOUR_BACKEND_SERVER.run.app';

  static Future<SimplifyResult> simplifyTerm({
    required String text,
    required String targetLanguage,
    required String englishLevel,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/api/simplify'),
      headers: {
        'Content-Type': 'application/json',
      },
      body: jsonEncode({
        'text': text,
        'targetLanguage': targetLanguage,
        'englishLevel': englishLevel,
      }),
    );

    if (response.statusCode == 200) {
      final decodedData = jsonDecode(response.body);
      return SimplifyResult.fromJson(decodedData);
    } else {
      throw Exception('Failed to translate and simplify: \${response.body}');
    }
  }
}
`;
