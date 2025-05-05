const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'space-around', // Pushes content and button apart
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: '30%', // Push content down a bit
    paddingBottom: 60,
  },
  contentBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  text: {
    fontSize: 22, // Slightly larger text
    color: 'white',
    textAlign: 'center',
    marginBottom: 20, // Space within the box
    lineHeight: 30,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
  button: {
    backgroundColor: '#FF9800', // Example Orange
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
