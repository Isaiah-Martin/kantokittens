import { StyleSheet } from 'react-native';

export const styles2 = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D98CBF',
    padding: 10,
    width: '100%',
  },
  loginMain: {
    padding: 16,
  },
  loginTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
  },
  successText: {
    color: 'green',
    marginBottom: 8,
  },
  loginButton: {
    marginTop: 16,
  },
  loadingIndicator: {
    marginTop: 8,
  },
  mainContainer: {
      flex: 1, 
      justifyContent: 'center', 
      paddingBottom: 10, 
      paddingHorizontal: 5,
  }, 
  scrollView: {
    paddingTop: 10,
    paddingHorizontal: 5
  },
  listItem: {
    marginBottom: 10,
  },
  itemCenter: {
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  itemLeft: {
    flexDirection: 'row', 
    justifyContent: 'flex-start', 
    alignItems: 'center',
  },
  itemRight: {
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    alignItems: 'center'
  },
  itemActivity: {
    backgroundColor: 'darkgreen',
    padding: 10,
    borderRadius: 5
  },
  textActivity: {
    color: 'white',
    fontSize: 18,
    lineHeight: 24     
  },
  spaceActivity: {
    height: 50,
  },
  titleText: {
    height: 32,
    fontSize: 22,
    fontWeight: '400'   
  },
  // Added button style
  button: {
    backgroundColor: 'black', // A standard blue background
    tintColor: '#D98CBF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  headingText: {
    fontSize: 18,
    lineHeight: 22,
    paddingVertical: 5
  }, 
  subjectText: {
    fontSize: 22,
    lineHeight: 36
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.5,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center'
  },
  statsRowContainerFluid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  statsBanner: {
    flex: 1,
    backgroundColor: '#D98CBF',
    borderRadius: 10,
    padding: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  }, 
});