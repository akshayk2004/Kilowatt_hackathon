import Colors from './Colors';

export const Theme = {
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  title: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: '700',
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  heading: {
    color: Colors.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 16,
  }
};
