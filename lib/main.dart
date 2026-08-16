import 'package:flutter/material.dart';

const green = Color(0xFF2E7D32);
const pale = Color(0xFFF4F8EE);

void main() => runApp(const LenivetsApp());

class LenivetsApp extends StatelessWidget {
  const LenivetsApp({super.key});
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Ленивец',
      theme: ThemeData(useMaterial3: true, colorScheme: ColorScheme.fromSeed(seedColor: green), scaffoldBackgroundColor: Colors.white),
      home: const Shell(),
    );
  }
}

class Shell extends StatefulWidget {
  const Shell({super.key});
  @override State<Shell> createState() => _ShellState();
}
class _ShellState extends State<Shell> {
  int index = 0;
  final pages = const [HomePage(), ProductsPage(), RecommendationsPage(), HistoryPage(), ProfilePage()];
  @override Widget build(BuildContext context) => Scaffold(
    body: SafeArea(child: pages[index]),
    bottomNavigationBar: NavigationBar(selectedIndex: index, onDestinationSelected: (i) => setState(() => index = i), destinations: const [
      NavigationDestination(icon: Icon(Icons.home_outlined), selectedIcon: Icon(Icons.home), label: 'Главная'),
      NavigationDestination(icon: Icon(Icons.kitchen_outlined), selectedIcon: Icon(Icons.kitchen), label: 'Продукты'),
      NavigationDestination(icon: Icon(Icons.lightbulb_outline), selectedIcon: Icon(Icons.lightbulb), label: 'Рекомендации'),
      NavigationDestination(icon: Icon(Icons.history), label: 'История'),
      NavigationDestination(icon: Icon(Icons.person_outline), selectedIcon: Icon(Icons.person), label: 'Профиль'),
    ]),
  );
}

class AppHeader extends StatelessWidget {
  final String title;
  const AppHeader(this.title, {super.key});
  @override Widget build(BuildContext context) => Padding(padding: const EdgeInsets.fromLTRB(20, 18, 20, 12), child: Row(children: [const Text('🦥', style: TextStyle(fontSize: 34)), const SizedBox(width: 10), Expanded(child: Text(title, style: const TextStyle(fontSize: 24, fontWeight: FontWeight.w800)))]));
}

class HomePage extends StatelessWidget {
  const HomePage({super.key});
  @override Widget build(BuildContext context) => ListView(padding: const EdgeInsets.all(18), children: [
    const AppHeader('ЛЕНИВЕЦ'),
    const Text('умный помощник из холодильника', style: TextStyle(fontSize: 18, color: Colors.black54)),
    const SizedBox(height: 18),
    Card(color: pale, child: const Padding(padding: EdgeInsets.all(18), child: Row(children: [Text('🦥', style: TextStyle(fontSize: 58)), SizedBox(width: 14), Expanded(child: Text('Говори, показывай или пиши. Я сам разберусь, что можно сделать.', style: TextStyle(fontSize: 16, height: 1.35)))]))),
    const SizedBox(height: 12),
    _ActionCard(icon: Icons.camera_alt, title: 'Сканировать холодильник', subtitle: 'Узнать, что можно приготовить', onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const ScannerPage()))),
    _ActionCard(icon: Icons.lightbulb_outline, title: 'Рекомендации', subtitle: 'Что приготовить из того, что есть', onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const RecommendationsPage()))),
    _ActionCard(icon: Icons.star_outline, title: 'Наши лучшие рецепты', subtitle: 'Top-20, константы и оценки', onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const BestRecipesPage()))),
    _ActionCard(icon: Icons.chat_bubble_outline, title: 'Чат с Ленивцем', subtitle: 'Спроси меня, что угодно', onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const ChatPage()))),
    _ActionCard(icon: Icons.settings_outlined, title: 'Настройки', subtitle: 'Профиль, предпочтения, безопасность, язык', onTap: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const SettingsPage()))),
  ]);
}

class _ActionCard extends StatelessWidget { final IconData icon; final String title, subtitle; final VoidCallback onTap; const _ActionCard({required this.icon, required this.title, required this.subtitle, required this.onTap}); @override Widget build(BuildContext context) => Card(margin: const EdgeInsets.only(bottom: 10), child: ListTile(leading: CircleAvatar(backgroundColor: pale, child: Icon(icon, color: green)), title: Text(title, style: const TextStyle(fontWeight: FontWeight.w700)), subtitle: Text(subtitle), trailing: const Icon(Icons.chevron_right), onTap: onTap)); }

class RecommendationsPage extends StatelessWidget {
  const RecommendationsPage({super.key});
  @override Widget build(BuildContext context) => ListView(padding: const EdgeInsets.all(18), children: [
    const AppHeader('Рекомендации для вас'),
    Card(color: pale, child: const Padding(padding: EdgeInsets.all(16), child: Text('На основе ваших продуктов я нашёл самые простые и полезные варианты.', style: TextStyle(fontSize: 16)))),
    const SizedBox(height: 12),
    Row(children: const [_Stat('12','100%','можно сейчас'), _Stat('8','≥85%','почти готово'), _Stat('5','купить','не хватает'), _Stat('7','замена','можно заменить')]),
    const SizedBox(height: 18),
    const Text('1. Можно приготовить прямо сейчас (100%)', style: TextStyle(fontSize: 19, fontWeight: FontWeight.w800)),
    const SizedBox(height: 8),
    _RecipeCard('Яичница с сосисками', '10 мин · Очень легко', '100%', Icons.egg_alt),
    _RecipeCard('Омлет с зеленью', '15 мин · Легко', '100%', Icons.restaurant),
    _RecipeCard('Сосиска с хлебом и горчицей', '5 мин · Очень легко', '100%', Icons.bakery_dining),
    const SizedBox(height: 16),
    const Text('2. Можно приготовить (≈85%)', style: TextStyle(fontSize: 19, fontWeight: FontWeight.w800)),
    const SizedBox(height: 8),
    Card(child: Padding(padding: const EdgeInsets.all(14), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      const Row(children: [Expanded(child: Text('Крем-суп из картофеля и лука-порея', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 16))), Chip(label: Text('85%'))]),
      const Text('Не хватает: лук-порей'), const SizedBox(height: 12),
      Row(children: const [Expanded(child: _MiniOption(Icons.eco, 'Заменить', 'луком, который уже есть')), Expanded(child: _MiniOption(Icons.shopping_basket, 'Докупить', 'показать рядом')), Expanded(child: _MiniOption(Icons.restaurant_menu, 'Похожее', 'без замены'))]),
    ]))),
    const SizedBox(height: 16),
    const Text('3. Нужно докупить', style: TextStyle(fontSize: 19, fontWeight: FontWeight.w800)),
    Card(child: ListTile(leading: const Text('🥛', style: TextStyle(fontSize: 34)), title: const Text('Молоко 2.5%', style: TextStyle(fontWeight: FontWeight.w700)), subtitle: const Text('Нужно для нескольких рецептов'), trailing: OutlinedButton(onPressed: () {}, child: const Text('Где купить')))),
    const SizedBox(height: 10),
    Card(color: const Color(0xFFFFF8E8), child: const Padding(padding: EdgeInsets.all(12), child: Text('Безопасность прежде всего: сомнительные продукты не предлагаю использовать.'))),
  ]);
}
class _Stat extends StatelessWidget { final String n, top, bottom; const _Stat(this.n,this.top,this.bottom); @override Widget build(BuildContext c)=>Expanded(child: Card(child: Padding(padding: const EdgeInsets.all(8), child: Column(children:[Text(n,style:const TextStyle(fontWeight:FontWeight.w800,fontSize:18)),Text(top,style:const TextStyle(color:green,fontWeight:FontWeight.w700)),Text(bottom,textAlign:TextAlign.center,style:const TextStyle(fontSize:11))])))); }
class _RecipeCard extends StatelessWidget { final String title, sub, match; final IconData icon; const _RecipeCard(this.title,this.sub,this.match,this.icon); @override Widget build(BuildContext c)=>Card(child:ListTile(leading:CircleAvatar(backgroundColor:pale,child:Icon(icon,color:green)),title:Text(title,style:const TextStyle(fontWeight:FontWeight.w700)),subtitle:Text(sub),trailing:Chip(label:Text(match)))); }
class _MiniOption extends StatelessWidget { final IconData icon; final String title, sub; const _MiniOption(this.icon,this.title,this.sub); @override Widget build(BuildContext c)=>Padding(padding:const EdgeInsets.all(4),child:Column(children:[Icon(icon,color:green),Text(title,style:const TextStyle(fontWeight:FontWeight.w700)),Text(sub,textAlign:TextAlign.center,style:const TextStyle(fontSize:11))])); }

class ProductsPage extends StatelessWidget { const ProductsPage({super.key}); @override Widget build(BuildContext c)=>ListView(padding:const EdgeInsets.all(18),children:[const AppHeader('Мои продукты'),...['🥚 Яйца','🌭 Сосиски','🥛 Молоко 2.5%','🧀 Сыр','🍅 Помидоры','🍞 Ржаной хлеб'].map((x)=>Card(child:ListTile(title:Text(x),subtitle:const Text('Состояние и срок хранения — в памяти Ленивца'),trailing:const Icon(Icons.chevron_right))))]); }
class HistoryPage extends StatelessWidget { const HistoryPage({super.key}); @override Widget build(BuildContext c)=>ListView(padding:const EdgeInsets.all(18),children:[const AppHeader('История и опыт'),const Text('Что готовили, что понравилось и какой опыт уже накоплен.',style:TextStyle(color:Colors.black54)),const SizedBox(height:10),...['Яичница с сосисками — 5★','Омлет с зеленью — 4★','Майонез от Рыжульки — 5★','Крем-суп — 4★'].map((x)=>Card(child:ListTile(title:Text(x),leading:const Icon(Icons.favorite,color:green))))]); }
class ProfilePage extends StatelessWidget { const ProfilePage({super.key}); @override Widget build(BuildContext c)=>ListView(padding:const EdgeInsets.all(18),children:[const AppHeader('Профиль'),_ActionCard(icon:Icons.star,title:'Наши лучшие рецепты',subtitle:'Рейтинг, Top-20, константы',onTap:(){Navigator.push(c,MaterialPageRoute(builder:(_)=>const BestRecipesPage()));}),_ActionCard(icon:Icons.settings,title:'Настройки',subtitle:'Ограничения, язык, безопасность',onTap:(){Navigator.push(c,MaterialPageRoute(builder:(_)=>const SettingsPage()));})]); }

class BestRecipesPage extends StatelessWidget { const BestRecipesPage({super.key}); @override Widget build(BuildContext c)=>Scaffold(appBar:AppBar(title:const Text('Наши лучшие рецепты')),body:ListView(padding:const EdgeInsets.all(18),children:[const Text('Top-20 · последние 90 дней',style:TextStyle(fontWeight:FontWeight.w700)),const SizedBox(height:8),...['Майонез от Рыжульки ⭐ 4.9 · КОНСТАНТА','Борщ домашний ⭐ 4.8','Сырники воздушные ⭐ 4.7','Веганский паштет ⭐ 4.7','Хумус классический ⭐ 4.6'].map((x)=>Card(child:ListTile(title:Text(x),subtitle:const Text('Отзывы и статистика доступны'),trailing:const Icon(Icons.chevron_right))))])); }

class SettingsPage extends StatefulWidget { const SettingsPage({super.key}); @override State<SettingsPage> createState()=>_SettingsState(); }
class _SettingsState extends State<SettingsPage> { bool safety=true, reminders=true; String diet='Без ограничений', lang='Русский'; @override Widget build(BuildContext c)=>Scaffold(appBar:AppBar(title:const Text('Настройки')),body:ListView(padding:const EdgeInsets.all(18),children:[const Text('Предпочтения и ограничения',style:TextStyle(fontSize:18,fontWeight:FontWeight.w800)),ListTile(title:const Text('Диетический режим'),subtitle:Text(diet),onTap:()=>setState(()=>diet=diet=='Без ограничений'?'Вегетарианец':'Без ограничений')),ListTile(title:const Text('Аллергии и непереносимости'),subtitle:const Text('Можно добавить голосом: арахис, лактоза и т. д.')),ListTile(title:const Text('Язык приложения и ответов'),subtitle:Text(lang),onTap:()=>setState(()=>lang=lang=='Русский'?'English':'Русский')),const Divider(),const Text('Безопасность',style:TextStyle(fontSize:18,fontWeight:FontWeight.w800)),SwitchListTile(title:const Text('Проверка свежести'),value:safety,onChanged:(v)=>setState(()=>safety=v)),SwitchListTile(title:const Text('Напоминания о продуктах'),value:reminders,onChanged:(v)=>setState(()=>reminders=v))])); }

class ChatPage extends StatelessWidget { const ChatPage({super.key}); @override Widget build(BuildContext c)=>Scaffold(appBar:AppBar(title:const Text('Чат с Ленивцем')),body:ListView(padding:const EdgeInsets.all(18),children:[const Text('🦥  Брат, что пожрать?',style:TextStyle(fontSize:22,fontWeight:FontWeight.w800)),const SizedBox(height:20),Card(child:const Padding(padding:EdgeInsets.all(16),child:Text('Вижу яйца и сосиски. Можно приготовить яичницу с сосисками — 100%. Если совсем лень, можно сделать самый простой вариант из того, что уже есть.'))),const SizedBox(height:10),const TextField(decoration:InputDecoration(hintText:'Скажи, что у тебя есть…',border:OutlineInputBorder(),suffixIcon:Icon(Icons.mic))) ])); }

class ScannerPage extends StatelessWidget { const ScannerPage({super.key}); @override Widget build(BuildContext c)=>Scaffold(appBar:AppBar(title:const Text('Сканер холодильника')),body:Center(child:Column(mainAxisAlignment:MainAxisAlignment.center,children:[const Text('📷',style:TextStyle(fontSize:80)),const SizedBox(height:18),const Text('Наведи камеру или добавь фото',style:TextStyle(fontSize:20,fontWeight:FontWeight.w700)),const SizedBox(height:18),FilledButton.icon(onPressed:()=>Navigator.push(c,MaterialPageRoute(builder:(_)=>const ScanResultsPage())),icon:const Icon(Icons.camera_alt),label:const Text('Начать сканирование'))])); }
class ScanResultsPage extends StatelessWidget { const ScanResultsPage({super.key}); @override Widget build(BuildContext c)=>Scaffold(appBar:AppBar(title:const Text('Результаты сканирования')),body:ListView(padding:const EdgeInsets.all(18),children:[const Text('Нашёл 6 продуктов',style:TextStyle(fontSize:20,fontWeight:FontWeight.w800)),...['Яйца — уверенность 98%','Сосиски — 96%','Молоко — 94%','Сыр — 92%','Помидоры — 93%','Ржаной хлеб — 97%'].map((x)=>Card(child:ListTile(title:Text(x),trailing:const Icon(Icons.chevron_right)))),FilledButton(onPressed:()=>Navigator.push(c,MaterialPageRoute(builder:(_)=>const RecommendationsPage())),child:const Text('Показать, что можно приготовить'))])); }
