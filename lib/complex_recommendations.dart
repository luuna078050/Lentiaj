import 'package:flutter/material.dart';

const complexGreen = Color(0xFF2E7D32);

class ComplexRecommendationsCard extends StatelessWidget {
  const ComplexRecommendationsCard({super.key});

  @override
  Widget build(BuildContext context) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text(
              'Если хочешь чуть-чуть заморочиться',
              style: TextStyle(fontSize: 19, fontWeight: FontWeight.w800),
            ),
            const SizedBox(height: 6),
            const Text(
              'Ленивец заметил сырьё, из которого можно сделать более интересное блюдо.',
            ),
            const SizedBox(height: 14),
            _ComplexOption(
              title: 'Мясо по-татарски',
              subtitle: 'Из размороженной лопатки · нужен контроль приготовления',
              time: '≈ 60–90 мин',
              equipment: 'Духовка / мультиварка',
            ),
            const Divider(),
            _ComplexOption(
              title: 'Тушёная лопатка с овощами',
              subtitle: 'Подготовить продукты и загрузить в прибор',
              time: '≈ 70 мин',
              equipment: 'Мультиварка',
            ),
            const Divider(),
            _ComplexOption(
              title: 'Запечённое мясо',
              subtitle: 'Больше ручной работы, зато дальше прибор делает почти всё',
              time: '≈ 90 мин',
              equipment: 'Духовка',
            ),
          ],
        ),
      ),
    );
  }
}

class _ComplexOption extends StatelessWidget {
  final String title;
  final String subtitle;
  final String time;
  final String equipment;

  const _ComplexOption({
    required this.title,
    required this.subtitle,
    required this.time,
    required this.equipment,
  });

  @override
  Widget build(BuildContext context) {
    return ListTile(
      contentPadding: EdgeInsets.zero,
      leading: const CircleAvatar(
        backgroundColor: Color(0xFFF4F8EE),
        child: Icon(Icons.restaurant, color: complexGreen),
      ),
      title: Text(title, style: const TextStyle(fontWeight: FontWeight.w700)),
      subtitle: Text('$subtitle\n$time · $equipment'),
      isThreeLine: true,
      trailing: const Icon(Icons.chevron_right),
    );
  }
}
